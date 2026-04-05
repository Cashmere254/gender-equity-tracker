# apps/reports/admin.py

from django.contrib import admin
from .models import Report, ReportSection

class ReportSectionInline(admin.TabularInline):
    """Shows all sections of a report inline on the report edit page."""
    model = ReportSection
    extra = 0
    fields = ('position_no', 'heading', 'content_json')
    ordering = ('position_no',)

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'program', 'status', 'created_by', 'updated_at')
    list_filter = ('status', 'program')
    search_fields = ('title',)
    inlines = [ReportSectionInline]

@admin.register(ReportSection)
class ReportSectionAdmin(admin.ModelAdmin):
    list_display = ('heading', 'position_no', 'report')
    list_filter = ('report',)