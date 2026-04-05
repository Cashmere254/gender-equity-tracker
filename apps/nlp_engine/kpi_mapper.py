# apps/nlp_engine/kpi_mapper.py

import json
from pathlib import Path
from .preprocessor import preprocess

# ─── Load keyword dictionary once at module startup ───────────────────────────
# Loading at module level (not inside the function) means it only reads the
# file once, not on every pipeline call --- significant performance improvement.
_KW_PATH = (
    Path(__file__).resolve().parent.parent.parent / 'nlp_data' / 'kpi_keywords.json'
)

with open(_KW_PATH, 'r', encoding='utf-8') as f:
    KPI_KEYWORDS = json.load(f)


def map_to_kpis(text: str, threshold: float = 0.10) -> list:
    """
    Matches a narrative text against all KPI keyword sets.

    For each KPI:
    - Tokenize the narrative text
    - Find the intersection with the KPI's keyword set
    - Compute confidence = matched_count / total_kpi_keywords
    - Only include KPIs where confidence >= threshold (default 10%)

    Returns a list of match dicts sorted by confidence (highest first):
    [
        {
            'indicator_code': 'GEQ-01',
            'confidence': 0.4,
            'matched_words': ['leadership', 'confident', 'empower']
        },
        ...
    ]

    The 'matched_words' field enables AI transparency --- the frontend
    can show users exactly which words triggered each KPI match.
    """

    tokens = set(preprocess(text))
    results = []

    for code, kpi_data in KPI_KEYWORDS.items():
        keywords = set(kpi_data['keywords'])
        matched = tokens & keywords  # set intersection

        if not matched:
            continue

        confidence = round(len(matched) / len(keywords), 3)

        if confidence >= threshold:
            results.append({
                'indicator_code': code,
                'confidence': confidence,
                'matched_words': sorted(list(matched))  # sorted for deterministic output
            })

    # Return sorted by confidence descending --- best match first
    return sorted(results, key=lambda x: x['confidence'], reverse=True)


def reload_keywords():
    """
    Reloads the keyword dictionary from disk.
    Call this after adding new keywords to kpi_keywords.json
    without restarting the Django server.
    """
    global KPI_KEYWORDS
    with open(_KW_PATH, 'r', encoding='utf-8') as f:
        KPI_KEYWORDS = json.load(f)