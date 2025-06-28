from django.urls import path
from .views import RegisterView, LoginView, VerifyOTPView, DashboardView
from rest_framework_simplejwt.views import TokenRefreshView  

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),  
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),

    # ✅ Token refresh endpoint
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
