# apps/nlp_engine/preprocessor.py

import re
import spacy
from pathlib import Path

# ─── Load spaCy model (once at module level --- faster than re-loading per call)
nlp = spacy.load('en_core_web_sm')

# ─── Load stopwords from nlp_data/stopwords.txt ──────────────────────────────
# Using the file means you can add/remove stopwords without editing Python code.
_STOPWORDS_PATH = (
    Path(__file__).resolve().parent.parent.parent / 'nlp_data' / 'stopwords.txt'
)

def _load_stopwords() -> set:
    """Reads nlp_data/stopwords.txt and returns a set of lowercase stopwords."""
    try:
        with open(_STOPWORDS_PATH, 'r', encoding='utf-8') as f:
            words = set()
            for line in f:
                stripped = line.strip().lower()
                # Skip blank lines and comment lines starting with #
                if stripped and not stripped.startswith('#'):
                    words.add(stripped)
            return words
    except FileNotFoundError:
        # Fallback to a minimal set if the file is missing
        return {'the', 'a', 'an', 'is', 'are', 'was', 'were', 'to', 'of', 'in', 'and', 'or'}


STOPWORDS = _load_stopwords()


def preprocess(text: str, language: str = 'en') -> list:
    """
    Cleans a narrative text and returns a list of meaningful lemmatised tokens.

    Steps:
    1. Lowercase and strip non-alphabetic characters
    2. Tokenise using spaCy (handles sentence boundaries and word forms)
    3. Lemmatise: 'leading' -> 'lead', 'schools' -> 'school'
    4. Remove stopwords (loaded from nlp_data/stopwords.txt)
    5. Remove punctuation, spaces, and single-character tokens

    The 'language' parameter is reserved for future multilingual support.
    Currently en_core_web_sm is used for all languages --- for Swahili
    narratives the Swahili synonyms in kpi_keywords.json compensate for
    this limitation.
    """

    # Step 1: Lowercase and remove non-alphabetic characters
    cleaned = text.lower()
    cleaned = re.sub(r'[^a-z\s]', ' ', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()

    # Steps 2-3: Tokenize and lemmatize with spaCy
    doc = nlp(cleaned)

    # Steps 4-5: Filter tokens
    tokens = [
        token.lemma_  # lemma = root form e.g., 'leading' -> 'lead'
        for token in doc
        if token.text not in STOPWORDS
        and token.lemma_ not in STOPWORDS
        and len(token.text) > 2
        and not token.is_punct
        and not token.is_space
    ]

    return tokens


def extract_noun_phrases(text: str) -> list:
    """
    Extracts multi-word noun phrases from text using spaCy's noun chunk detection.
    Examples: 'leadership confidence', 'young women', 'economic empowerment'
    Multi-word phrases carry more specific meaning than single tokens.
    """
    doc = nlp(text.lower())
    # Only return phrases longer than 3 characters to avoid noise
    return [
        chunk.text.strip()
        for chunk in doc.noun_chunks
        if len(chunk.text.strip()) > 3
    ]