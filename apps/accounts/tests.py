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

# ADD here (Append to the bottom)

from django.urls import reverse
from rest_framework.test import APIClient


class AuthAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username='apiuser',
            email='api@akili.org',
            password='strongpass123',
            role='ME Officer'
        )

    def test_register_new_user(self):
        response = self.client.post('/api/auth/register/', {
            'email': 'newuser@akili.org',
            'username': 'newuser',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'newpass123',
            'role': 'Donor'
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            CustomUser.objects.filter(email='newuser@akili.org').exists()
        )

    def test_login_returns_tokens(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'apiuser',
            'password': 'strongpass123'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_wrong_password_returns_401(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'apiuser',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 401)

    def test_me_endpoint_requires_auth(self):
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, 401)

    def test_me_endpoint_returns_user_profile(self):
        login_response = self.client.post('/api/auth/login/', {
            'username': 'apiuser',
            'password': 'strongpass123'
        })
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['email'], 'api@akili.org')
        self.assertEqual(response.data['role'], 'ME Officer')

    def test_forgot_password_always_returns_200(self):
        # Test with registered email
        resp1 = self.client.post('/api/auth/password-reset-request/',
            {'email': 'api@akili.org'})
        self.assertEqual(resp1.status_code, 200)

        # Test with non-existent email --- should also return 200 (security)
        resp2 = self.client.post('/api/auth/password-reset-request/',
            {'email': 'notexist@test.com'})
        self.assertEqual(resp2.status_code, 200)

    def test_upload_requires_auth(self):
        response = self.client.post('/api/documents/upload/',
            {'program_id': 'some-id'})
        self.assertEqual(response.status_code, 401)