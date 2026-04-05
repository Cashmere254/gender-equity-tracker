# apps/dashboard/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Count
from apps.nlp_engine.models import AIExtraction


class KPISummaryView(APIView):
    """
    GET /api/dashboard/kpi-summary/?program_id=...
    Returns aggregated KPI data grouped by indicator.
    Each object has: indicator code, name, category,
    avg_confidence, avg_sentiment, evidence_count.
    This data directly populates the dashboard KPI cards.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        program_id = request.query_params.get('program_id')

        # Build queryset --- filter by programme if provided
        qs = AIExtraction.objects.select_related('narrative', 'indicator')

        if program_id:
            qs = qs.filter(narrative__program_id=program_id)

        # Aggregate: group by indicator, compute averages and count
        summary = (
            qs
            .values(
                'indicator__code',
                'indicator__name',
                'indicator__kpi_category'
            )
            .annotate(
                avg_confidence=Avg('confidence'),
                avg_sentiment=Avg('sentiment'),
                evidence_count=Count('id')
            )
            .order_by('-avg_confidence')
        )

        return Response(list(summary))