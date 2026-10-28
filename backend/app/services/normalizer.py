import re
import unicodedata
from bs4 import BeautifulSoup

# Map Devanagari numerals (०-९) to ASCII (0-9)
DEVANAGARI_DIGITS_MAP = str.maketrans("०१२३४५६७८९", "0123456789")


def convert_devanagari_digits(text: str) -> str:
    """Convert Marathi/Devanagari numerals to standard ASCII numerals for reliable comparison & parsing."""
    if not text:
        return ""
    return text.translate(DEVANAGARI_DIGITS_MAP)


def normalize_html(html_content: str) -> str:
    """
    Strips noise from HTML pages:
    - Removes scripts, styles, headers, footers, navbars, ads, and page render counters.
    - Preserves core content paragraphs, tables, headings.
    - Applies Unicode NFC normalization.
    """
    if not html_content:
        return ""

    soup = BeautifulSoup(html_content, "html.parser")

    # Remove irrelevant script, style, and navigation tags
    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "noscript", "svg"]):
        tag.decompose()

    # Get clean text separated by newline
    text = soup.get_text(separator="\n")

    # Normalize Unicode NFC
    text = unicodedata.normalize("NFC", text)

    # Clean redundant whitespace while keeping paragraph structure
    lines = [line.strip() for line in text.splitlines()]
    clean_lines = [line for line in lines if line]
    clean_text = "\n".join(clean_lines)

    return clean_text


def normalize_source_text(raw_text: str, is_html: bool = True) -> str:
    """Main normalizer entry point for crawl snapshots."""
    if is_html:
        clean = normalize_html(raw_text)
    else:
        clean = unicodedata.normalize("NFC", raw_text)
        lines = [line.strip() for line in clean.splitlines() if line.strip()]
        clean = "\n".join(lines)

    return clean
