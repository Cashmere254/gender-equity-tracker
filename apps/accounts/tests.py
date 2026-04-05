# apps/accounts/tests.py

from django.test import TestCase
from apps.accounts.models import CustomUser, AuditLog

class CustomUserModelTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='test@akili.org',
            password='testpass123',
            role='ME Officer'
        )

    def test_user_created_with_correct_role(self):
        self.assertEqual(self.user.role, 'ME Officer')

    def test_user_email_is_unique(self):
        with self.assertRaises(Exception):
            CustomUser.objects.create_user(
                username='testuser2', email='test@akili.org',
                password='pass', role='Donor'
            )

    def test_str_representation(self):
        self.assertIn('test@akili.org', str(self.user))


class AuditLogModelTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='audituser', email='audit@akili.org', password='pass'
        )

    def test_auditlog_created(self):
        log = AuditLog.objects.create(
            user=self.user, action='TEST_ACTION', entity_type='Test'
        )
        self.assertEqual(AuditLog.objects.count(), 1)
        self.assertEqual(log.action, 'TEST_ACTION')