# apps/nlp_engine/models.py

from django.db import models
import uuid

class AIExtraction(models.Model):
    """
    Stores the output of one NLP analysis on a single Narrative chunk.
    Each record links a narrative to a KPI with supporting evidence.

    Fields explained:
    - value: relevance score (same as confidence for v1.0 algorithm)
    - sentiment: -1.0 (very negative) to +1.0 (very positive)
    - confidence: 0.0 to 1.0 --- fraction of KPI keywords matched
    - model_version: bump this string when the NLP algorithm improves
    - extracted_at: timestamp for audit and rollback analysis
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    narrative = models.ForeignKey(
        'documents.Narrative', on_delete=models.CASCADE,
        related_name='extractions'
    )
    indicator = models.ForeignKey(
        'programs.Indicator', on_delete=models.CASCADE,
        related_name='extractions'
    )
    value = models.DecimalField(max_digits=5, decimal_places=2)
    sentiment = models.DecimalField(max_digits=4, decimal_places=3)
    confidence = models.DecimalField(max_digits=4, decimal_places=3)
    model_version = models.CharField(max_length=20, default='v1.0')
    extracted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-extracted_at']

    def __str__(self):
        return (
            f'{self.indicator.code} | conf:{self.confidence} | '
            f'sent:{self.sentiment} | {self.extracted_at.date()}'
        )