# apps/nlp_engine/tests.py

from django.test import TestCase
from apps.accounts.models import CustomUser
from apps.programs.models import Program, Indicator
from apps.documents.models import Document, Narrative
from apps.nlp_engine.models import AIExtraction
from apps.nlp_engine.preprocessor import preprocess
from apps.nlp_engine.theme_extractor import extract_themes
from apps.nlp_engine.sentiment import score_sentiment
from apps.nlp_engine.kpi_mapper import map_to_kpis
from apps.nlp_engine.pipeline import run_pipeline
import datetime
from decimal import Decimal


class PreprocessorTest(TestCase):

    def test_preprocess_lowercases_text(self):
        tokens = preprocess('Leadership CONFIDENCE')
        self.assertTrue(all(t == t.lower() for t in tokens))

    def test_preprocess_removes_stopwords(self):
        tokens = preprocess('the cat sat on the mat')
        self.assertNotIn('the', tokens)
        self.assertNotIn('on', tokens)

    def test_preprocess_lemmatises(self):
        tokens = preprocess('She was leading the workshop confidently')
        # 'leading' -> 'lead'
        self.assertIn('lead', tokens)

    def test_preprocess_returns_list(self):
        result = preprocess('Any text here')
        self.assertIsInstance(result, list)

    def test_preprocess_empty_string(self):
        result = preprocess('')
        self.assertEqual(result, [])


class SentimentTest(TestCase):

    def test_positive_narrative_returns_positive_score(self):
        text = 'She felt confident, empowered, safe and proud after the workshop'
        score = score_sentiment(text)
        self.assertGreater(score, 0)

    def test_negative_narrative_returns_negative_score(self):
        text = 'Violence and abuse created fear and unsafe conditions for her'
        score = score_sentiment(text)
        self.assertLess(score, 0)

    def test_neutral_narrative_returns_zero(self):
        text = 'The meeting was held at 9am on Tuesday'
        score = score_sentiment(text)
        self.assertEqual(score, 0.0)

    def test_score_within_range(self):
        text = 'She grew and struggled equally'
        score = score_sentiment(text)
        self.assertGreaterEqual(score, -1.0)
        self.assertLessEqual(score, 1.0)


class KPIMapperTest(TestCase):

    def test_leadership_narrative_matches_geq01(self):
        text = 'Amina showed strong leadership and confidence in her decision-making'
        matches = map_to_kpis(text)
        codes = [m['indicator_code'] for m in matches]
        self.assertIn('GEQ-01', codes)

    def test_education_narrative_matches_geq03(self):
        text = 'She received a scholarship to continue her education and study at university'
        matches = map_to_kpis(text)
        codes = [m['indicator_code'] for m in matches]
        self.assertIn('GEQ-03', codes)

    def test_irrelevant_text_returns_empty(self):
        text = 'The meeting started at 9am attendance was noted'
        matches = map_to_kpis(text)
        self.assertEqual(matches, [])

    def test_matched_words_populated(self):
        text = 'She leads with great confidence and empowers others'
        matches = map_to_kpis(text)
        if matches:
            self.assertIn('matched_words', matches[0])
            self.assertIsInstance(matches[0]['matched_words'], list)
            self.assertGreater(len(matches[0]['matched_words']), 0)

    def test_confidence_within_range(self):
        text = 'She leads with great confidence and empowers others'
        matches = map_to_kpis(text)
        for m in matches:
            self.assertGreaterEqual(m['confidence'], 0.0)
            self.assertLessEqual(m['confidence'], 1.0)

    def test_results_sorted_by_confidence_descending(self):
        text = (
            'She leads with great confidence and empowers others. '
            'She is safe and protected from violence and abuse.'
        )
        matches = map_to_kpis(text)
        if len(matches) > 1:
            confidences = [m['confidence'] for m in matches]
            self.assertEqual(confidences, sorted(confidences, reverse=True))


class PipelineIntegrationTest(TestCase):
    """
    End-to-end pipeline test: creates a real Narrative in the database,
    runs the pipeline, and verifies AIExtraction records are saved correctly.
    """

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='nlptest',
            email='nlp@akili.org',
            password='pass123'
        )
        self.program = Program.objects.create(
            name='NLP Integration Test Program',
            start_date=datetime.date.today(),
            created_by=self.user
        )
        # Create the indicator so the pipeline can link to it
        self.indicator = Indicator.objects.create(
            code='GEQ-01',
            name='Leadership Confidence',
            kpi_category='Leadership'
        )
        self.doc = Document.objects.create(
            program=self.program,
            file_name='test_report.txt',
            mime_type='text/plain',
            uri='uploads/test.txt',
            uploaded_by=self.user
        )

    def test_pipeline_saves_extraction_for_matching_narrative(self):
        narrative = Narrative.objects.create(
            document=self.doc,
            program=self.program,
            text='She showed outstanding leadership and confidence at the workshop',
        )
        results = run_pipeline(narrative)
        # At least one AIExtraction should be saved
        self.assertGreater(AIExtraction.objects.count(), 0)
        if results:
            self.assertEqual(results[0]['indicator_code'], 'GEQ-01')

    def test_pipeline_skips_short_narratives(self):
        narrative = Narrative.objects.create(
            document=self.doc,
            program=self.program,
            text='Short text',  # < 5 words
        )
        results = run_pipeline(narrative)
        self.assertEqual(results, [])
        self.assertEqual(AIExtraction.objects.count(), 0)

    def test_pipeline_returns_empty_for_irrelevant_text(self):
        narrative = Narrative.objects.create(
            document=self.doc,
            program=self.program,
            text='The meeting started at 9am on Tuesday morning attendance was noted',
        )
        results = run_pipeline(narrative)
        self.assertEqual(results, [])