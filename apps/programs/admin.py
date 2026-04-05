# apps/programs/admin.py

from django.contrib import admin
from .models import Program, Grant, Indicator

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'end_date', 'created_by', 'created_at')
    list_filter = ('start_date',)
    search_fields = ('name', 'description')

@admin.register(Grant)
class GrantAdmin(admin.ModelAdmin):
    list_display = ('grant_code', 'donor_name', 'program', 'reporting_period')
    list_filter = ('donor_name',)
    search_fields = ('grant_code', 'donor_name')

@admin.register(Indicator)
class IndicatorAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'kpi_category')
    list_filter = ('kpi_category',)
    search_fields = ('code', 'name')
    ordering = ('code',)