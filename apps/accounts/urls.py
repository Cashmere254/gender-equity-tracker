# apps/accounts/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Authentication
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('me/', views.MeView.as_view(), name='me'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),

    # Password reset (two-step flow)
    path('password-reset-request/', views.ForgotPasswordView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/', views.ResetPasswordView.as_view(), name='password_reset_confirm'),
]