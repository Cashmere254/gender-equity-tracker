# apps/nlp_engine/tests.py

from django.test import TestCase
from apps.accounts.models import CustomUser
from apps.programs.models import Program, Indicator
from apps.documents.models import Document, Narrative
from apps.nlp_engine.models import AIExtraction
from decimal import Decimal
import datetime

class AIExtractionModelTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='nlp', email='nlp@akili.org', password='pass'
        )
        self.program = Program.objects.create(
            name='NLP Test',
            start_date=datetime.date.today(),
            created_by=self.user
        )
        self.indicator = Indicator.objects.create(
            code='GEQ-01', name='Leadership Confidence',
            kpi_category='Leadership'
        )
        self.doc = Document.objects.create(
            program=self.program,
            file_name='report.txt',
            mime_type='text/plain',
            uri='uploads/report.txt',
            uploaded_by=self.user
        )
        self.narrative = Narrative.objects.create(
            document=self.doc,
            program=self.program,
            text='She leads with great confidence and empowers others.'
        )

    def test_extraction_created_and_linked(self):
        ext = AIExtraction.objects.create(
            narrative=self.narrative,
            indicator=self.indicator,
            value=Decimal('0.40'),
            sentiment=Decimal('0.750'),
            confidence=Decimal('0.400'),
            model_version='v1.0'
        )
        self.assertEqual(self.narrative.extractions.count(), 1)
        self.assertEqual(ext.indicator.code, 'GEQ-01')

    def test_confidence_within_range(self):
        ext = AIExtraction.objects.create(
            narrative=self.narrative,
            indicator=self.indicator,
            value=Decimal('0.30'),
            sentiment=Decimal('0.500'),
            confidence=Decimal('0.300'),
            model_version='v1.0'
        )
        self.assertGreaterEqual(ext.confidence, Decimal('0.0'))
        self.assertLessEqual(ext.confidence, Decimal('1.0'))