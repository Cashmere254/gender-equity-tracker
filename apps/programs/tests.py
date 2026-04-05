# apps/programs/tests.py

from django.test import TestCase
from apps.accounts.models import CustomUser
from apps.programs.models import Program, Grant, Indicator
import datetime

class ProgramModelTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='pm', email='pm@akili.org',
            password='pass', role='Program Manager'
        )
        self.program = Program.objects.create(
            name='Leadership Lab Q1 2026',
            start_date=datetime.date(2026, 1, 1),
            created_by=self.user
        )

    def test_program_created(self):
        self.assertEqual(Program.objects.count(), 1)
        self.assertEqual(self.program.name, 'Leadership Lab Q1 2026')

    def test_grant_linked_to_program(self):
        Grant.objects.create(
            program=self.program,
            donor_name='Donor A',
            grant_code='DONOR-A-2026',
            reporting_period='Q1 2026'
        )
        self.assertEqual(self.program.grants.count(), 1)


class IndicatorModelTest(TestCase):

    def test_indicator_code_unique(self):
        Indicator.objects.create(
            code='TEST-01', name='Test KPI', kpi_category='Test'
        )
        with self.assertRaises(Exception):
            Indicator.objects.create(
                code='TEST-01', name='Duplicate', kpi_category='Test'
            )

# ADD/Append here

from rest_framework.test import APIClient


class ProgramAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username='me_officer',
            email='me@akili.org',
            password='pass123',
            role='ME Officer'
        )
        # Authenticate the client
        login = self.client.post('/api/auth/login/', {
            'username': 'me_officer',
            'password': 'pass123'
        })
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login.data['access']}"
        )

    def test_create_program(self):
        response = self.client.post('/api/programs/programs/', {
            'name': 'Test Program',
            'start_date': '2026-01-01'
        })
        self.assertEqual(response.status_code, 201)

    def test_list_indicators(self):
        Indicator.objects.create(
            code='GEQ-01',
            name='Leadership Confidence',
            kpi_category='Leadership'
        )
        response = self.client.get('/api/programs/indicators/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_unauthenticated_cannot_list_programs(self):
        unauthenticated = APIClient()
        response = unauthenticated.get('/api/programs/programs/')
        self.assertEqual(response.status_code, 401)