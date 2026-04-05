# apps/reports/models.py

from django.db import models
import uuid

class Report(models.Model):
    """
    A donor impact report composed of ordered sections.
    Reports are built in the Report Builder UI via drag-and-drop.
    Status flow: Draft → Published → Archived
    """

    class Status(models.TextChoices):
        DRAFT = 'Draft', 'Draft'
        PUBLISHED = 'Published', 'Published'
        ARCHIVED = 'Archived', 'Archived'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.ForeignKey(
        'programs.Program', on_delete=models.CASCADE,
        related_name='reports'
    )
    grant = models.ForeignKey(
        'programs.Grant', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='reports'
    )
    title = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.DRAFT
    )
    period_start = models.DateField(null=True, blank=True)
    period_end = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey(
        'accounts.CustomUser', on_delete=models.SET_NULL,
        null=True, related_name='reports'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f'{self.title} [{self.status}]'


class ReportSection(models.Model):
    """
    One ordered section within a Report.
    content_json stores flexible section data:
    { 'type': 'kpi_grid', 'content': '...', 'kpi_codes': ['GEQ-01'] }
    { 'type': 'narrative', 'content': 'Amina joined the...' }
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(
        Report, on_delete=models.CASCADE, related_name='sections'
    )
    position_no = models.PositiveIntegerField()  # order in the report (1, 2, 3...)
    heading = models.CharField(max_length=200)
    content_json = models.JSONField(default=dict)

    class Meta:
        ordering = ['position_no']

    def __str__(self):
        return f'Section {self.position_no}: {self.heading}'