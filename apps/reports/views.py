# apps/reports/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from .models import Report, ReportSection
from .exporter import export_report_to_docx
from apps.accounts.models import AuditLog


class ReportListView(APIView):
    """GET /api/reports/ --- list all reports owned by the current user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reports = Report.objects.filter(
            created_by=request.user
        ).order_by('-updated_at')

        data = [
            {
                'id': str(r.id),
                'title': r.title,
                'status': r.status,
                'program': r.program.name if r.program else None,
                'updated_at': r.updated_at.isoformat()
            }
            for r in reports
        ]
        return Response(data)


class ReportSaveView(APIView):
    """
    POST /api/reports/save/
    Creates a new report or updates an existing draft.
    Accepts: { program_id, title, sections: [{heading, content}...],
    report_id (optional) }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        program_id = request.data.get('program_id')
        title = request.data.get('title', 'Untitled Report')
        sections = request.data.get('sections', [])
        report_id = request.data.get('report_id')

        if not program_id:
            return Response(
                {'error': 'program_id is required.'},
                status=400
            )

        if report_id:
            try:
                report = Report.objects.get(
                    id=report_id, created_by=request.user
                )
            except Report.DoesNotExist:
                return Response(
                    {'error': 'Report not found.'},
                    status=404
                )
        else:
            report = Report.objects.create(
                program_id=program_id,
                title=title,
                created_by=request.user
            )

        # Replace all existing sections (simplest approach for MVP)
        report.sections.all().delete()

        for i, section_data in enumerate(sections, start=1):
            ReportSection.objects.create(
                report=report,
                position_no=i,
                heading=section_data.get('heading', f'Section {i}'),
                content_json={'content': section_data.get('content', '')}
            )

        AuditLog.objects.create(
            user=request.user,
            action='SAVE_REPORT',
            entity_type='Report',
            entity_id=report.id
        )

        return Response(
            {'report_id': str(report.id)},
            status=status.HTTP_201_CREATED
        )


class ReportExportDocxView(APIView):
    """
    GET /api/reports/<report_id>/export-docx/
    Generates and returns a .docx file for the specified report.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, report_id):
        try:
            report = Report.objects.get(
                id=report_id, created_by=request.user
            )
        except Report.DoesNotExist:
            return Response(
                {'error': 'Report not found.'},
                status=404
            )

        docx_buffer = export_report_to_docx(report)
        filename = f'{report.title.replace(" ", "_")}.docx'

        response = HttpResponse(
            docx_buffer.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
        response['Content-Disposition'] = f'attachment; filename="{filename}"'

        AuditLog.objects.create(
            user=request.user,
            action='EXPORT_REPORT_DOCX',
            entity_type='Report',
            entity_id=report.id
        )

        return response