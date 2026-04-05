# apps/reports/tests.py

from django.test import TestCase
from apps.accounts.models import CustomUser
from apps.programs.models import Program
from apps.reports.models import Report, ReportSection
import datetime

class ReportModelTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='reporter', email='reporter@akili.org', password='pass'
        )
        self.program = Program.objects.create(
            name='Report Test Program',
            start_date=datetime.date.today(),
            created_by=self.user
        )
        self.report = Report.objects.create(
            program=self.program,
            title='Q1 2026 Impact Report',
            created_by=self.user
        )

    def test_report_created_as_draft(self):
        self.assertEqual(self.report.status, 'Draft')
        self.assertEqual(Report.objects.count(), 1)

    def test_report_section_linked(self):
        section = ReportSection.objects.create(
            report=self.report,
            position_no=1,
            heading='Executive Summary',
            content_json={'type': 'executive_summary', 'content': 'Test'}
        )
        self.assertEqual(self.report.sections.count(), 1)
        self.assertEqual(section.heading, 'Executive Summary')