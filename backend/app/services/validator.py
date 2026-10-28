import re
from typing import Dict, Any, Tuple
from app.services.normalizer import convert_devanagari_digits

MAHARASHTRA_DISTRICTS = {
    "ahmednagar", "akola", "amravati", "chhatrapati sambhajinagar", "aurangabad",
    "beed", "bhandara", "buldhana", "chandrapur", "dhule", "gadchiroli", "gondia",
    "hingoli", "jalgaon", "jalna", "kolhapur", "latur", "mumbai city", "mumbai suburban",
    "nagpur", "nanded", "nandurbar", "nashik", "dharashiv", "osmanabad", "palghar",
    "parbhani", "pune", "raigad", "ratnagiri", "sangli", "satara", "sindhudurg",
    "solapur", "thane", "wardha", "washim", "yavatmal"
}


def validate_extraction_rules(
    fields: Dict[str, Any],
    evidence_spans: Dict[str, str],
    source_text: str,
    confidence: float = 1.0,
) -> Tuple[str, Dict[str, Any]]:
    """
    Validates extractions against deterministic safety rules.
    Returns:
      (status, rule_results)
      Status can only be 'Auto-checked' or 'Needs review'.
      NEVER outputs 'Verified' automatically; human sign-off is mandatory.
    """
    rule_results = {
        "evidence_quotes_present": True,
        "evidence_quotes_verbatim": True,
        "deadlines_valid": True,
        "regions_valid": True,
        "confidence_sufficient": confidence >= 0.75,
        "failures": [],
    }

    normalized_source = source_text.strip()
    ascii_source = convert_devanagari_digits(normalized_source)

    # 1. Check that required fields have evidence quotes
    required_quote_fields = ["name", "department", "eligibility", "benefits"]
    for req_field in required_quote_fields:
        quote = evidence_spans.get(req_field, "").strip()
        if not quote:
            rule_results["evidence_quotes_present"] = False
            rule_results["failures"].append(f"Missing evidence quote for required field '{req_field}'")
        else:
            # 2. Check quote exists verbatim in source text (checking both original and ASCII digit converted)
            quote_clean = quote.strip()
            ascii_quote = convert_devanagari_digits(quote_clean)
            if quote_clean not in normalized_source and ascii_quote not in ascii_source:
                rule_results["evidence_quotes_verbatim"] = False
                rule_results["failures"].append(
                    f"Evidence quote for '{req_field}' is not verbatim in source text"
                )

    # 3. Check deadlines
    deadlines = fields.get("deadlines", [])
    if deadlines:
        # Check for obvious conflicts (e.g., more than 2 distinct conflicting deadline dates without explanation)
        if len(set(deadlines)) > 2:
            rule_results["deadlines_valid"] = False
            rule_results["failures"].append("Conflicting deadlines detected across multiple mentions")

    # 4. Check regions
    regions = fields.get("regions", [])
    if regions:
        for r in regions:
            r_clean = r.strip().lower()
            # empty/all/statewide is fine, else must be a recognized district or regional keyword
            if r_clean not in MAHARASHTRA_DISTRICTS and "all" not in r_clean and "state" not in r_clean:
                # Flag for review to ensure region name spelling
                rule_results["regions_valid"] = False
                rule_results["failures"].append(f"Unrecognized region '{r}' in notice")
                break

    # 5. Determine status
    if (
        rule_results["evidence_quotes_present"]
        and rule_results["evidence_quotes_verbatim"]
        and rule_results["deadlines_valid"]
        and rule_results["regions_valid"]
        and rule_results["confidence_sufficient"]
    ):
        status = "Auto-checked"
    else:
        status = "Needs review"

    return status, rule_results
