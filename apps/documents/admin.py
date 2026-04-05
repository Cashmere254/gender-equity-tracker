from django.contrib import admin

# Final form: admin.site.register(Document)  admin.site.register(Narrative)  admin.site.register(DataSource)# apps/documents/admin.py

from django.contrib import admin
from .models import DataSource, Document, Narrative

@admin.register(DataSource)
class DataSourceAdmin(admin.ModelAdmin):
    list_display = ('source_type', 'program', 'ingested_at')
    list_filter = ('source_type',)

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('file_name', 'mime_type', 'program', 'uploaded_by', 'uploaded_at')
    list_filter = ('mime_type', 'program')
    search_fields = ('file_name',)

@admin.register(Narrative)
class NarrativeAdmin(admin.ModelAdmin):
    list_display = ('document', 'program', 'language', 'created_at')
    list_filter = ('program', 'language')
    search_fields = ('text',)

    # Show a preview of text rather than the full content
    def text_preview(self, obj):
        return obj.text[:80] + '...'
    text_preview.short_description = 'Text Preview'