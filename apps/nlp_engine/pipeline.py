# apps/nlp_engine/pipeline.py

import logging
from .preprocessor import preprocess
from .theme_extractor import extract_themes
from .sentiment import score_sentiment
from .kpi_mapper import map_to_kpis
from .models import AIExtraction
from apps.programs.models import Indicator

logger = logging.getLogger(__name__)

# Bump this string each time you improve the algorithm.
# Stored in every AIExtraction record so you can audit
# which version produced each result.
MODEL_VERSION = 'v1.0'


def run_pipeline(narrative) -> list:
    """
    Runs the full NLP pipeline on a single Narrative object.
    Called by DocumentUploadView for each narrative chunk.

    Process:
    1. Skip narratives that are too short to analyse meaningfully (< 5 words)
    2. Score sentiment (-1 to +1)
    3. Map narrative to matching KPIs with confidence scores
    4. Save one AIExtraction record per matching KPI
    5. Return list of extraction dicts (used in API response)

    Error handling: if any step fails, the error is logged and an empty
    list is returned --- the upload workflow is NOT interrupted.
    """

    text = narrative.text.strip()

    # Guard: skip very short chunks (headers, page numbers, etc.)
    if len(text.split()) < 5:
        logger.info(
            f'Narrative {narrative.id}: too short '
            f'({len(text.split())} words) --- skipping'
        )
        return []

    try:
        # Stage 3: Score sentiment
        sentiment = score_sentiment(text)

        # Stage 4: Map to KPIs
        kpi_matches = map_to_kpis(text)

        # Stage 2: Extract themes (available for future dashboard features)
        themes = extract_themes(text)

        saved = []

        for match in kpi_matches:
            # Look up the Indicator ORM object
            try:
                indicator = Indicator.objects.get(
                    code=match['indicator_code']
                )
            except Indicator.DoesNotExist:
                logger.warning(
                    f"KPI '{match['indicator_code']}' in kpi_keywords.json "
                    f"but not in DB --- "
                    f"run: python manage.py loaddata initial_indicators"
                )
                continue

            extraction = AIExtraction.objects.create(
                narrative=narrative,
                indicator=indicator,
                value=match['confidence'],
                sentiment=sentiment,
                confidence=match['confidence'],
                model_version=MODEL_VERSION
            )

            saved.append({
                'extraction_id': str(extraction.id),
                'indicator_code': match['indicator_code'],
                'indicator_name': indicator.name,
                'confidence': match['confidence'],
                'sentiment': sentiment,
                'matched_words': match['matched_words'],  # shown in UI for traceability
                'themes': themes,
                'model_version': MODEL_VERSION
            })

        return saved

    except Exception as e:
        logger.error(f'NLP pipeline failed on narrative {narrative.id}: {e}')
        return []  # fail silently --- do not crash the upload