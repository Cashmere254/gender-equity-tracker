# test_nlp.py --- run with: python test_nlp.py
# This script tests the NLP pipeline end-to-end with sample narratives.
# Run from the project root with venv active.

import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.nlp_engine.preprocessor import preprocess
from apps.nlp_engine.theme_extractor import extract_themes
from apps.nlp_engine.sentiment import score_sentiment
from apps.nlp_engine.kpi_mapper import map_to_kpis

# === Test Narrative 1 --- Leadership + Education ===
sample_1 = """
After attending the leadership workshop, Amina felt more confident
speaking in her community. She secured a scholarship to continue
her education and now mentors younger girls in her village.
She reports feeling safe and empowered to make decisions for herself.
"""

print('=== TEST 1: Leadership + Education Narrative ===')
print('TOKENS (first 10):', preprocess(sample_1)[:10])
print('THEMES:           ', extract_themes(sample_1, top_n=3))
print('SENTIMENT:        ', score_sentiment(sample_1))
print('KPI MATCHES:')
for match in map_to_kpis(sample_1):
    print(
        f"  {match['indicator_code']} --- "
        f"confidence: {match['confidence']} --- "
        f"matched: {match['matched_words']}"
    )

# === Test Narrative 2 --- Safety / GBV ===
sample_2 = """
The participant disclosed gender-based violence at home.
She is receiving counselling and support from the protection team.
She reports feeling safer but remains vulnerable.
"""

print()
print('=== TEST 2: Safety / GBV Narrative ===')
print('SENTIMENT:', score_sentiment(sample_2))
print('KPI MATCHES:')
for match in map_to_kpis(sample_2):
    print(
        f"  {match['indicator_code']} --- "
        f"confidence: {match['confidence']} --- "
        f"matched: {match['matched_words']}"
    )

# === Test Narrative 3 --- No KPI Match ===
sample_3 = 'The meeting started at 9am. Attendance was noted.'

print()
print('=== TEST 3: Non-narrative text (expect empty KPI list) ===')
print('KPI MATCHES:', map_to_kpis(sample_3))

# === Test Narrative 4 --- Swahili keywords ===
sample_4 = """
Amina alionyesha ujasiri mkubwa katika uongozi wake.
Alipata elimu bora na sasa anasaidia jamii yake.
"""

print()
print('=== TEST 4: Swahili Narrative ===')
print('SENTIMENT:', score_sentiment(sample_4))
print('KPI MATCHES:')
for match in map_to_kpis(sample_4):
    print(
        f"  {match['indicator_code']} --- "
        f"confidence: {match['confidence']} --- "
        f"matched: {match['matched_words']}"
    )

print()
print('All tests complete.')