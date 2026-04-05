# apps/programs/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Program, Grant, Indicator
from .serializers import ProgramSerializer, GrantSerializer, IndicatorSerializer


class ProgramViewSet(viewsets.ModelViewSet):
    """Full CRUD for Program objects. GET/POST/PUT/DELETE /api/programs/programs/"""
    queryset = Program.objects.all().order_by('-created_at')
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically assign the current user as created_by
        serializer.save(created_by=self.request.user)


class GrantViewSet(viewsets.ModelViewSet):
    """CRUD for Grants --- supports filtering by ?program_id=... query param."""
    serializer_class = GrantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Grant.objects.all()
        program_id = self.request.query_params.get('program_id')
        if program_id:
            qs = qs.filter(program_id=program_id)
        return qs


class IndicatorViewSet(viewsets.ModelViewSet):
    """KPI list --- pre-seeded via fixtures, should not be created via API in normal usage."""
    queryset = Indicator.objects.all().order_by('code')
    serializer_class = IndicatorSerializer
    permission_classes = [IsAuthenticated]