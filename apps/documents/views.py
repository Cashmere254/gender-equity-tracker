# apps/documents/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage
from .models import Document, Narrative
from .parsers import extract_text, split_into_chunks
from apps.nlp_engine.pipeline import run_pipeline
from apps.accounts.models import AuditLog


class DocumentUploadView(APIView):
    """
    POST /api/documents/upload/
    Accepts a file + programme_id. Saves to media/, extracts text,
    creates Narrative chunks, runs NLP pipeline on each chunk.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        program_id = request.data.get('program_id')

        if not uploaded_file or not program_id:
            return Response(
                {'error': 'Both file and program_id are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate file type before saving
        allowed_types = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'text/csv'
        ]

        if uploaded_file.content_type not in allowed_types:
            return Response(
                {'error': f'Unsupported file type: {uploaded_file.content_type}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Save the file to media/uploads/
        saved_path = default_storage.save(
            f'uploads/{uploaded_file.name}', uploaded_file
        )
        full_path = default_storage.path(saved_path)

        # 2. Create the Document record
        doc = Document.objects.create(
            program_id=program_id,
            file_name=uploaded_file.name,
            mime_type=uploaded_file.content_type,
            uri=saved_path,
            uploaded_by=request.user
        )

        # 3. Extract text and split into narrative chunks
        try:
            raw_text = extract_text(full_path, uploaded_file.content_type)
        except Exception as e:
            doc.delete()
            return Response(
                {'error': f'Text extraction failed: {str(e)}'},
                status=500
            )

        chunks = split_into_chunks(raw_text)

        if not chunks:
            return Response(
                {'error': 'No text could be extracted from this file.'},
                status=400
            )

        # 4. Save each chunk as a Narrative and trigger NLP analysis
        for chunk in chunks:
            narrative = Narrative.objects.create(
                document=doc,
                program_id=program_id,
                text=chunk
            )
            run_pipeline(narrative)  # Week 5 --- stub for now

        # 5. Log the upload action for audit compliance
        AuditLog.objects.create(
            user=request.user,
            action='UPLOAD_DOCUMENT',
            entity_type='Document',
            entity_id=doc.id
        )

        return Response(
            {'document_id': str(doc.id), 'chunks': len(chunks)},
            status=status.HTTP_201_CREATED
        )


class NarrativeListView(generics.ListAPIView):
    """
    GET /api/documents/narratives/
    Returns all narratives with their source document and matched KPIs.
    Powers the Evidence Library page --- supports filtering by programme.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        program_id = request.query_params.get('program_id')
        qs = Narrative.objects.select_related('document', 'program')

        if program_id:
            qs = qs.filter(program_id=program_id)

        data = []
        for n in qs:
            # Get matched KPIs for this narrative
            extractions = n.extractions.select_related('indicator').all()
            kpis = [
                {
                    'code': e.indicator.code,
                    'name': e.indicator.name,
                    'confidence': float(e.confidence),
                    'sentiment': float(e.sentiment)
                }
                for e in extractions
            ]

            data.append({
                'id': str(n.id),
                'text': n.text,
                'text_preview': n.text[:120] + '...' if len(n.text) > 120 else n.text,
                'document_name': n.document.file_name,
                'program': n.program.name,
                'language': n.language,
                'created_at': n.created_at.isoformat(),
                'kpis': kpis
            })

        return Response(data)