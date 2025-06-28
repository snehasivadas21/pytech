from rest_framework import viewsets,permissions,filters
from .models import Course,CourseCategory,Module,Lesson
from .serializers import CourseSerializer,CourseCategorySerializer,ModuleSerializer,LessonSerializer
from users.permissions import IsAdminUser, IsInstructorUser
from rest_framework.permissions import AllowAny,IsAuthenticated


class AdminCourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated,IsAdminUser]

    def get_queryset(self):
        status = self.request.query_params.get("status")
        queryset = Course.objects.all()
        if status:
            queryset = queryset.filter(status=status)
        return queryset.order_by("-created_at")

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

class InstructorCourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated,IsInstructorUser]

    def get_queryset(self):
        return Course.objects.filter(instructor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user, status='submitted')

class CourseCategoryViewSet(viewsets.ModelViewSet):
    queryset = CourseCategory.objects.all()
    serializer_class = CourseCategorySerializer
    permission_classes = [IsAdminUser]        

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [IsAuthenticated,IsInstructorUser]

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated,IsInstructorUser]
    
    def get_queryset(self):
        module_id = self.request.query_params.get('module')
        qs = super().get_queryset()
        if module_id:
            qs = qs.filter(module_id=module_id)
        return qs