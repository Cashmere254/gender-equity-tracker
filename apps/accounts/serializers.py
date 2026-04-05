# apps/accounts/serializers.py

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser


class CustomTokenSerializer(TokenObtainPairSerializer):
    """
    Extends the default JWT token to include email and role.
    This means the React frontend can read the user's role directly
    from the token without an extra /me/ request.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['role'] = user.role
        return token


class RegisterSerializer(serializers.ModelSerializer):
    """Used by POST /api/auth/register/ --- validates and creates a new user."""

    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'role']

    def create(self, validated_data):
        # create_user hashes the password --- never call
        # CustomUser.objects.create() directly
        return CustomUser.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    """Used by GET /api/auth/me/ --- returns the current user's profile."""

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'role']


class ChangePasswordSerializer(serializers.Serializer):
    """Used by POST /api/auth/change-password/ --- for the Settings page."""

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError('New passwords do not match.')
        return data