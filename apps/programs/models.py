# apps/programs/models.py

from django.db import models
import uuid

class Program(models.Model):
    """
    A funded programme or project being monitored.
    Example: 'Leadership Lab Q3 2025', 'Girls Education Initiative 2026'.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)  # null = ongoing
    created_by = models.ForeignKey(
        'accounts.CustomUser', on_delete=models.SET_NULL,
        null=True, related_name='programs'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Grant(models.Model):
    """
    A funding agreement between a programme and a donor.
    One programme can have multiple grants over time.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.ForeignKey(
        Program, on_delete=models.CASCADE, related_name='grants'
    )
    donor_name = models.CharField(max_length=200)
    grant_code = models.CharField(max_length=50, unique=True)  # e.g. DONOR-A-2025
    reporting_period = models.CharField(max_length=50)         # e.g. 'Q3 2025'
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.grant_code} --- {self.donor_name}'


class Indicator(models.Model):
    """
    A Key Performance Indicator (KPI) that donors expect evidence for.
    Pre-seeded via fixtures --- not created by end users.
    Codes must match keys in nlp_data/kpi_keywords.json exactly.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, unique=True)   # e.g. 'GEQ-01'
    name = models.CharField(max_length=200)               # e.g. 'Leadership Confidence'
    description = models.TextField(blank=True, null=True)
    kpi_category = models.CharField(max_length=100)       # e.g. 'Leadership'

    class Meta:
        ordering = ['code']

    def __str__(self):
        return f'{self.code}: {self.name}'