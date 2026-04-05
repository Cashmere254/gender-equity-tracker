# apps/accounts/views.py

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings
from .models import CustomUser
from .serializers import (
    CustomTokenSerializer, RegisterSerializer,
    UserProfileSerializer, ChangePasswordSerializer
)


class LoginView(TokenObtainPairView):
    """POST /api/auth/login/ --- returns JWT access + refresh tokens."""
    serializer_class = CustomTokenSerializer
    permission_classes = [AllowAny]


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ --- creates a new user account."""
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class MeView(generics.RetrieveAPIView):
    """GET /api/auth/me/ --- returns the current user's profile."""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """POST /api/auth/change-password/ --- for the Settings page."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'error': 'Current password is incorrect.'},
                status=400
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response(
            {'detail': 'Password updated successfully.'},
            status=200
        )


class ForgotPasswordView(APIView):
    """
    POST /api/auth/password-reset-request/
    Accepts an email address and sends a password reset link.
    Uses Django's built-in PasswordResetTokenGenerator for secure tokens.
    In development (console email backend) the reset link prints to terminal.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            # Always return 200 --- never confirm whether email exists (security)
            return Response(
                {'detail': 'If that email is registered, a reset link has been sent.'},
                status=200
            )

        token_gen = PasswordResetTokenGenerator()
        token = token_gen.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"

        send_mail(
            subject='Reset Your GEI Tracker Password',
            message=(
                f'Hello {user.first_name},\n\n'
                f'Click the link below to reset your password:\n{reset_url}\n\n'
                f'If you did not request this, please ignore this email.'
            ),
            from_email='noreply@geitracker.org',
            recipient_list=[email],
            fail_silently=False,
        )

        return Response(
            {'detail': 'If that email is registered, a reset link has been sent.'},
            status=200
        )


class ResetPasswordView(APIView):
    """
    POST /api/auth/password-reset-confirm/
    Accepts uid + token from the reset link URL and sets the new password.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password', '')
        confirm = request.data.get('confirm_password', '')

        if new_password != confirm:
            return Response({'error': 'Passwords do not match.'}, status=400)

        if len(new_password) < 8:
            return Response(
                {'error': 'Password must be at least 8 characters.'},
                status=400
            )

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = CustomUser.objects.get(pk=user_id)
        except (CustomUser.DoesNotExist, ValueError, TypeError):
            return Response({'error': 'Invalid reset link.'}, status=400)

        token_gen = PasswordResetTokenGenerator()
        if not token_gen.check_token(user, token):
            return Response(
                {'error': 'Reset link has expired or is invalid.'},
                status=400
            )

        user.set_password(new_password)
        user.save()
        return Response(
            {'detail': 'Password reset successfully. You can now sign in.'},
            status=200
        )