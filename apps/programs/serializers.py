# apps/programs/serializers.py

from rest_framework import serializers
from .models import Program, Grant, Indicator


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ['id', 'name', 'description', 'start_date', 'end_date', 'created_at']


class GrantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grant
        fields = ['id', 'program', 'donor_name', 'grant_code', 'reporting_period']


class IndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = ['id', 'code', 'name', 'description', 'kpi_category']