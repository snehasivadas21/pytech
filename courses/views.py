from rest_framework import viewsets,permissions
from .models import Course,CourseCategory,Module,Lesson,Question,Quiz,Choice,QuizSubmission
from .serializers import AdminCourseSerializer,InstructorCourseSerializer,CourseCategorySerializer,ModuleSerializer,LessonSerializer,QuizSerializer,QuestionSerializer,ChoiceSerializer,QuizSubmissionSerializer
from users.permissions import IsInstructorUser,IsAdminUser
from .tasks import send_course_status_email


class AdminCourseViewSet(viewsets.ModelViewSet):
    queryset=Course.objects.all().order_by('-created_at')
    serializer_class = AdminCourseSerializer
    permission_classes = [permissions.IsAuthenticated,IsAdminUser]

    def perform_update(self,serializer):
        old_status = serializer.instance.status
        course = serializer.save()
        if old_status != course.status:
            send_course_status_email.delay(course.id)

class InstructorCourseViewSet(viewsets.ModelViewSet):
    serializer_class = InstructorCourseSerializer
    permission_classes = [permissions.IsAuthenticated,IsInstructorUser]

    def get_queryset(self):
        return Course.objects.filter(instructor=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

class CourseCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CourseCategory.objects.filter(is_active=True).order_by('name')
    serializer_class = CourseCategorySerializer
    permission_classes = [permissions.IsAuthenticated]        

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated,IsInstructorUser]

    def get_queryset(self):
        course_id = self.request.query_params.get('course')
        qs = Module.objects.filter(course__instructor=self.request.user, is_deleted=False)
        if course_id:
            qs = qs.filter(course_id=course_id)
        return qs
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()
        return Response({'message': 'Deleted successfully (soft delete)'}, status=status.HTTP_204_NO_CONTENT)



class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated,IsInstructorUser]
    
    def get_queryset(self):
        module_id = self.request.query_params.get('module')
        qs = Lesson.objects.filter(module__course__instructor=self.request.user, is_deleted=False)
        if module_id:
            qs = qs.filter(module_id=module_id)
        return qs
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()
        return Response({'message': 'Deleted successfully (soft delete)'}, status=status.HTTP_204_NO_CONTENT)


class QuizViewSet(viewsets.ModelViewSet):
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorUser]

    def get_queryset(self):
        return Quiz.objects.filter(module__course__instructor=self.request.user)

    def perform_create(self, serializer):
        serializer.save()


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorUser]

    def get_queryset(self):
        return Question.objects.filter(quiz__module__course__instructor=self.request.user)

    def perform_create(self, serializer):
        serializer.save()


class ChoiceViewSet(viewsets.ModelViewSet):
    serializer_class = ChoiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructorUser]

    def get_queryset(self):
        return Choice.objects.filter(question__quiz__module__course__instructor=self.request.user)

    def perform_create(self, serializer):
        serializer.save()

class QuizSubmissionViewSet(viewsets.ModelViewSet):
    queryset = QuizSubmission.objects.all()
    serializer_class = QuizSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)        
