# apps/nlp_engine/admin.py

from django.contrib import admin
from .models import AIExtraction

@admin.register(AIExtraction)
class AIExtractionAdmin(admin.ModelAdmin):
    """
    View AI extraction results in the admin panel.
    This is the primary tool for verifying the NLP pipeline
    is working correctly.
    """

    list_display = (
        'indicator', 'confidence', 'sentiment',
        'model_version', 'narrative_preview', 'extracted_at'
    )
    list_filter = ('indicator', 'model_version')
    search_fields = ('narrative__text', 'indicator__code')
    ordering = ('-extracted_at',)
    readonly_fields = (
        'id', 'narrative', 'indicator', 'value',
        'sentiment', 'confidence', 'model_version', 'extracted_at'
    )

    def narrative_preview(self, obj):
        return obj.narrative.text[:60] + '...'
    narrative_preview.short_description = 'Narrative'

    # Prevent accidental deletion of AI results
    def has_delete_permission(self, request, obj=None):
        return False