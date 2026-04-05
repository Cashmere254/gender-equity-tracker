# apps/documents/tests.py

from django.test import TestCase
from apps.accounts.models import CustomUser
from apps.programs.models import Program
from apps.documents.models import Document, Narrative
import datetime

class DocumentModelTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='me', email='me@akili.org', password='pass'
        )
        self.program = Program.objects.create(
            name='Test Program',
            start_date=datetime.date.today(),
            created_by=self.user
        )

    def test_document_and_narrative_created(self):
        doc = Document.objects.create(
            program=self.program,
            file_name='test.txt',
            mime_type='text/plain',
            uri='uploads/test.txt',
            uploaded_by=self.user
        )
        narrative = Narrative.objects.create(
            document=doc,
            program=self.program,
            text='Amina showed great leadership confidence.',
        )
        self.assertEqual(doc.narratives.count(), 1)
        self.assertEqual(narrative.language, 'en')  # default