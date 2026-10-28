import hashlib
import difflib
from typing import Tuple, Optional


def compute_content_hash(normalized_text: str) -> str:
    """Compute deterministic SHA-256 hash of normalized text."""
    return hashlib.sha256(normalized_text.encode("utf-8")).hexdigest()


def compute_text_diff(old_text: str, new_text: str) -> Optional[str]:
    """
    Generate unified diff between previous and current text.
    Returns unified diff string, or None if no meaningful textual difference exists.
    """
    old_lines = old_text.splitlines(keepends=True)
    new_lines = new_text.splitlines(keepends=True)

    diff = list(
        difflib.unified_diff(
            old_lines,
            new_lines,
            fromfile="previous_version",
            tofile="current_version",
            lineterm="",
        )
    )

    if not diff:
        return None

    # Filter out empty or whitespace-only diff artifacts
    diff_str = "\n".join(diff)
    return diff_str


def is_significant_change(old_text: str, new_text: str) -> Tuple[bool, Optional[str]]:
    """
    Detect whether new text contains substantial semantic changes compared to old text.
    Returns (has_changed, diff_text).
    """
    old_hash = compute_content_hash(old_text)
    new_hash = compute_content_hash(new_text)

    if old_hash == new_hash:
        return False, None

    diff = compute_text_diff(old_text, new_text)
    if not diff:
        return False, None

    return True, diff
