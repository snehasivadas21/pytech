from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated,AllowAny

from .models import CustomUser, EmailOTP
from .serializers import RegisterSerializer, LoginSerializer
from .permissions import IsVerifiedUser

import random

class RegisterView(APIView):
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
            send_mail(
                subject='Verify your email',
                message=f'Your OTP is {otp.otp}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False
            )
            print(f"OTP for {user.email} is: {otp.otp}")
            return Response({"message": "User registered. Check your email for OTP."}, status=201)
        print("❌ Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=400)


class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp_input = request.data.get('otp')

        try:
            user = CustomUser.objects.get(email=email)
            otp = EmailOTP.objects.get(user=user)

            if otp.is_expired():
                return Response({'error': 'OTP expired'}, status=400)

            if otp.otp != otp_input:
                return Response({'error': 'Invalid OTP'}, status=400)

            user.is_verified = True
            user.save()
            otp.delete()

            return Response({'message': 'Email verified successfully'}, status=200)

        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        except EmailOTP.DoesNotExist:
            return Response({'error': 'OTP not found'}, status=404)


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


class DashboardView(APIView):
    permission_classes=[IsAuthenticated,IsVerifiedUser]
    def get(self,request):
        return Response({"message":f"Welcome,{request.user.username}! This is your dashboard"})
