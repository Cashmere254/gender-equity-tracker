# apps/accounts/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class CustomUser(AbstractUser):
    """
    Extends Django's built-in user model with a role field.
    USERNAME_FIELD = 'username' (default kept --- required for JWT simplejwt).
    Email is also unique so it can be used as a login identifier.
    """

    class Role(models.TextChoices):
        ADMIN = 'Admin', 'Admin'
        ME_OFFICER = 'ME Officer', 'M&E Officer'
        PROGRAM_MANAGER = 'Program Manager', 'Program Manager'
        DONOR = 'Donor', 'Donor'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.ME_OFFICER
    )

    def __str__(self):
        return f'{self.email} ({self.role})'


class AuditLog(models.Model):
    """
    Records every significant action for GDPR and Kenya Data Protection
    Act compliance. Created automatically in views --- never delete these.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL,
        null=True, related_name='audit_logs'
    )
    action = models.TextField()          # e.g. 'UPLOAD_DOCUMENT', 'EXPORT_REPORT'
    entity_type = models.CharField(max_length=50)  # e.g. 'Document', 'Report'
    entity_id = models.UUIDField(null=True, blank=True)
    occurred_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-occurred_at']

    def __str__(self):
        return f'{self.user} --- {self.action} at {self.occurred_at}'