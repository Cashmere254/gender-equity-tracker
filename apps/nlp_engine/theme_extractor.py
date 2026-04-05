# apps/nlp_engine/theme_extractor.py

from collections import Counter
from .preprocessor import preprocess, extract_noun_phrases


def extract_themes(text: str, top_n: int = 5) -> list:
    """
    Identifies the top N most significant themes in a narrative.

    Strategy:
    1. Extract noun phrases (multi-word, e.g. 'leadership confidence')
    2. Count token frequency for single keywords
    3. Prioritize noun phrases --- they carry more specific meaning
    4. Fill remaining slots with top single-word tokens

    Returns a list of theme strings (most significant first) up to top_n items.
    These themes are shown in the Evidence Library page for each narrative.
    """

    tokens = preprocess(text)
    noun_phrases = extract_noun_phrases(text)

    # Count how often each token appears
    freq = Counter(tokens)

    themes = []

    # Prioritize multi-word noun phrases (deduplicated)
    for phrase in noun_phrases:
        if phrase and phrase not in themes:
            themes.append(phrase)
        if len(themes) >= top_n:
            break

    # Fill remaining slots with top single tokens not already in themes
    for word, _ in freq.most_common(top_n * 3):
        if len(themes) >= top_n:
            break
        # Only add if word doesn't already appear in an existing theme
        if not any(word in t for t in themes):
            themes.append(word)

    return themes[:top_n]