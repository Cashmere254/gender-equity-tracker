# apps/documents/models.py

from django.db import models
import uuid

class DataSource(models.Model):
    """
    Records the origin of uploaded data.
    One programme can have multiple data sources (PDF uploads, CSV exports, etc.).
    """

    class SourceType(models.TextChoices):
        PDF = 'PDF', 'PDF Document'
        DOCX = 'DOCX', 'Word Document'
        CSV = 'CSV', 'CSV Spreadsheet'
        TXT = 'TXT', 'Plain Text'
        MANUAL_ENTRY = 'Manual Entry', 'Manual Entry'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.ForeignKey(
        'programs.Program', on_delete=models.CASCADE,
        related_name='data_sources'
    )
    source_type = models.CharField(max_length=20, choices=SourceType.choices)
    source_ref = models.TextField(null=True, blank=True)  # URL or descriptive note
    ingested_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.source_type} --- {self.program.name}'


class Document(models.Model):
    """
    One uploaded file. The actual bytes live in media/uploads/.
    This record stores metadata and links the file to a programme.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.ForeignKey(
        'programs.Program', on_delete=models.CASCADE,
        related_name='documents'
    )
    data_source = models.ForeignKey(
        DataSource, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='documents'
    )
    file_name = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=100)
    uri = models.TextField()  # relative path inside media/
    uploaded_by = models.ForeignKey(
        'accounts.CustomUser', on_delete=models.SET_NULL,
        null=True, related_name='uploaded_documents'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f'{self.file_name} ({self.program.name})'


class Narrative(models.Model):
    """
    A single paragraph or text chunk extracted from a Document.
    Each narrative is analysed individually by the NLP pipeline.
    This is the most important table for the AI pipeline --- every
    AI result traces back to a specific narrative.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(
        Document, on_delete=models.CASCADE, related_name='narratives'
    )
    program = models.ForeignKey(
        'programs.Program', on_delete=models.CASCADE,
        related_name='narratives'
    )
    text = models.TextField()
    language = models.CharField(max_length=10, default='en')  # ISO code: en, sw
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'Narrative from {self.document.file_name} ({self.text[:50]}...)'