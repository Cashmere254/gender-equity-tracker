# apps/accounts/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, AuditLog

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """Extends the default UserAdmin to show the role field."""
    list_display = ('email', 'username', 'first_name', 'last_name', 'role', 'is_active')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)

    # Add 'role' to the fieldsets so it appears on the edit page
    fieldsets = UserAdmin.fieldsets + (
        ('Role & Access', {'fields': ('role',)}),
    )

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    """Read-only audit log --- staff should view but not edit."""
    list_display = ('user', 'action', 'entity_type', 'entity_id', 'occurred_at')
    list_filter = ('action', 'entity_type')
    search_fields = ('user__email', 'action')
    readonly_fields = ('id', 'user', 'action', 'entity_type', 'entity_id', 'occurred_at')

    def has_add_permission(self, request): return False
    def has_delete_permission(self, request, obj=None): return False