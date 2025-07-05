from django.urls import path
from .views import RegisterView, LoginView, VerifyOTPView, ResendOTPView ,StudentDashboardView,InstructorDashboardView
from rest_framework_simplejwt.views import TokenRefreshView , TokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),  
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('resend-otp/', ResendOTPView.as_view(),name='resend-otp'),
    path('student/dashboard/', StudentDashboardView.as_view(), name='student-dashboard'),
    path('instructor/dashboard/',InstructorDashboardView.as_view(),name='instructor-dashboard'),

    path('token/', TokenObtainPairView.as_view(), name="get_token"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
