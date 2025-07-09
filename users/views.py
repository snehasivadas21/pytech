from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated,AllowAny

from .models import CustomUser, EmailOTP
from .serializers import RegisterSerializer, LoginSerializer,CustomTokenObtainPairSerializer
from .permissions import IsInstructorUser
from .tasks import send_otp_email_task

from courses.models import Enrollment,Course,LessonProgress
from quiz.models import QuizSubmission,Quiz
from payment.models import CoursePurchase
from django.db.models import Avg,Sum

import random

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            otp_code = str(random.randint(100000, 999999))
            otp = EmailOTP.objects.create(
                user=user,
                otp=otp_code,
                created_at=timezone.now()
            )
            send_otp_email_task.delay(user.email,otp_code)
            
            print(f"OTP for {user.email} is: {otp.otp}")
            return Response({"message": "User registered. Check your email for OTP."}, status=201)
        print("❌ Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=400)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        otp_input = request.data.get('otp')

        try:
            user = CustomUser.objects.get(email=email)
            otp = EmailOTP.objects.get(user=user)

            if otp.is_expired():
                return Response({'error': 'OTP expired'}, status=400)
            
            if otp.used:
                return Response({'error':'OTP already user'},status=400)

            if otp.otp != otp_input:
                return Response({'error': 'Invalid OTP'}, status=400)

            user.is_verified = True
            user.save()
            otp.used=True
            otp.save()

            return Response({'message': 'Email verified successfully'}, status=200)

        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        except EmailOTP.DoesNotExist:
            return Response({'error': 'OTP not found'}, status=404)
        
class ResendOTPView(APIView):
    permission_classes=[AllowAny]

    def post(self,request):
        email = request.data.get("email")

        try:
            user=CustomUser.objects.get(email=email)

            EmailOTP.objects.filter(user=user).delete()

            otp_code=str(random.randint(1000000,999999))
            otp=EmailOTP.objects.create(user=user,otp=otp_code)

            send_otp_email_task.delay(user.email,otp_code)

            return Response({"message":"OTP resent successfully."},status=200)
        except CustomUser.DoesNotExist:
            return Response({"error":"User not found"},status=404)       


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'token': str(refresh.access_token),
                'username': user.username,
                'role': user.role
            }, status=200)
        return Response(serializer.errors, status=401)


class StudentDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Fetch enrolled courses
        enrollments = Enrollment.objects.filter(student=user)
        total_courses = enrollments.count()

        # Course progress
        total_lessons_completed = LessonProgress.objects.filter(student=user).count()

        # Quiz stats
        quiz_submissions = QuizSubmission.objects.filter(student=user)
        total_quizzes_taken = quiz_submissions.count()
        avg_score = quiz_submissions.aggregate(avg=Avg('score')).get('avg') or 0

        # Response
        data = {
            "username": user.username,
            "email": user.email,
            "profile": {
                "bio": getattr(user.student_profile, 'bio', ''),
                "dob": getattr(user.student_profile, 'dob', ''),
                "phone": getattr(user.student_profile, 'phone', ''),
            },
            "enrolled_courses": total_courses,
            "lessons_completed": total_lessons_completed,
            "quizzes_taken": total_quizzes_taken,
            "average_quiz_score": round(avg_score, 2),
        }

        return Response(data)
    
class InstructorDashboardView(APIView):
    permission_classes = [IsAuthenticated,IsInstructorUser]

    def get(self,request):
        instructor = request.user 

        courses = Course.objects.filter(instructor=instructor)
        course_ids = courses.values_list('id',flat=True)

        total_courses = courses.count()
        total_students= CoursePurchase.objects.filter(course__in=courses,is_paid=True).count()
        total_earnings =CoursePurchase.objects.filter(course__in=courses,is_paid=True).aggregate(
            total = Sum('price'))['total'] or 0.0
        average_ratings = courses.aggregate(avg=Avg('rating'))['avg'] or 0.0
        total_quizzes = Quiz.objects.filter(module__course__in=courses).count()
        return Response({
            "total_courses":total_courses,
            "total_students":total_students,
            "total_earnings":total_earnings,
            "average_rating":round(average_ratings,2),
            "total_quizzes" : total_quizzes

        })
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer    
