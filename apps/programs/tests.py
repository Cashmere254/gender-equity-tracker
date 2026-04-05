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