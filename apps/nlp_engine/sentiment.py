# apps/nlp_engine/sentiment.py

from .preprocessor import preprocess

# ─── Positive word list ───────────────────────────────────────────────────────
# Words that signal positive outcomes in feminist programme narratives.
# Expand this list as you review real Akili Dada reports.
POSITIVE_WORDS = {
    'confident', 'empower', 'improve', 'achieve', 'grow', 'succeed',
    'lead', 'inspire', 'strong', 'support', 'opportunity', 'transform',
    'progress', 'hopeful', 'resilient', 'capable', 'excel', 'thrive',
    'proud', 'safe', 'happy', 'motivated', 'engage', 'positive',
    'learn', 'graduate', 'mentor', 'scholarship', 'income', 'earn',
    'community', 'advocate', 'change', 'protect', 'rights',
    # Swahili positive indicators
    'ujasiri', 'elimu', 'usalama', 'jamii', 'mabadiliko', 'maendeleo'
}

# ─── Negative word list ───────────────────────────────────────────────────────
# Words that signal challenges, barriers, or negative experiences.
NEGATIVE_WORDS = {
    'struggle', 'challenge', 'difficult', 'barrier', 'violence', 'abuse',
    'fear', 'unsafe', 'poor', 'lack', 'unable', 'fail', 'refuse',
    'discriminate', 'exclude', 'harm', 'risk', 'stigma', 'vulnerable',
    'poverty', 'drop', 'dropout', 'crisis', 'threat', 'danger',
    # Swahili negative indicators
    'ukatili', 'hofu', 'hatari', 'vikwazo', 'umaskini'
}


def score_sentiment(text: str) -> float:
    """
    Returns a sentiment polarity score between -1.0 (very negative)
    and +1.0 (very positive). Returns 0.0 for neutral text.

    Formula: (positive_count - negative_count) / total_sentiment_words

    A score of 0.7 means 70% of sentiment words were positive.
    A score of -0.5 means 75% of sentiment words were negative.

    Uses the preprocessed token SET (not list) for O(1) intersection.
    """

    tokens = set(preprocess(text))

    pos_count = len(tokens & POSITIVE_WORDS)
    neg_count = len(tokens & NEGATIVE_WORDS)
    total = pos_count + neg_count

    if total == 0:
        return 0.0  # Neutral --- no sentiment words found

    # Scale to -1 .. +1
    return round((pos_count - neg_count) / total, 3)