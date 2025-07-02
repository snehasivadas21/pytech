from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import AdminCourseViewSet, InstructorCourseViewSet, CourseCategoryViewSet,ModuleViewSet,LessonViewSet,QuestionViewSet,QuizViewSet,ChoiceViewSet,QuizSubmissionViewSet

router = DefaultRouter()
router.register(r'admin/courses', AdminCourseViewSet, basename='admin-courses')
router.register(r'instructor/courses', InstructorCourseViewSet, basename='instructor-courses')
router.register(r'categories', CourseCategoryViewSet, basename='course-category')
router.register(r'modules', ModuleViewSet, basename='module')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'quizzes', QuizViewSet, basename='quizzes')
router.register(r'questions', QuestionViewSet, basename='questions')
router.register(r'choices', ChoiceViewSet, basename='choices')
router.register(r'submit', QuizSubmissionViewSet, basename='quiz-submission')

urlpatterns = router.urls  
