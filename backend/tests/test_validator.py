from app.services.validator import validate_extraction_rules


def test_valid_extraction_passes_to_auto_checked():
    source_text = (
        "कृषी विभाग, महाराष्ट्र शासन\n"
        "योजनेचे नाव: सूक्ष्म सिंचन योजना\n"
        "पात्रता: अल्प व अत्यल्प भूधारक शेतकरी\n"
        "लाभ: ५५% अनुदान\n"
        "अंतिम मुदत: ३१ ऑगस्ट २०२६\n"
    )

    fields = {
        "name": "सूक्ष्म सिंचन योजना",
        "department": "कृषी विभाग, महाराष्ट्र शासन",
        "eligibility": "अल्प व अत्यल्प भूधारक शेतकरी",
        "benefits": "५५% अनुदान",
        "deadlines": ["३१ ऑगस्ट २०२६"],
        "regions": ["nashik"],
    }

    evidence_spans = {
        "name": "योजनेचे नाव: सूक्ष्म सिंचन योजना",
        "department": "कृषी विभाग, महाराष्ट्र शासन",
        "eligibility": "पात्रता: अल्प व अत्यल्प भूधारक शेतकरी",
        "benefits": "लाभ: ५५% अनुदान",
    }

    status, results = validate_extraction_rules(fields, evidence_spans, source_text)
    assert status == "Auto-checked"
    assert results["evidence_quotes_verbatim"] is True
    assert len(results["failures"]) == 0


def test_fabricated_quote_fails_and_flags_needs_review():
    source_text = "कृषी विभाग, महाराष्ट्र शासन\nअर्ज सादर करा."

    fields = {
        "name": "काल्पनिक योजना",
        "department": "कृषी विभाग, महाराष्ट्र शासन",
        "eligibility": "सर्व शेतकरी",
        "benefits": "१०००० रुपये भरपाई",
    }

    # Fabricated evidence quotes that do not exist in the source
    evidence_spans = {
        "name": "ही ओळ मूळ कागदपत्रात नाही",
        "department": "कृषी विभाग, महाराष्ट्र शासन",
        "eligibility": "सर्व शेतकरी पात्र",
        "benefits": "भरपाई रक्कम",
    }

    status, results = validate_extraction_rules(fields, evidence_spans, source_text)
    assert status == "Needs review"
    assert results["evidence_quotes_verbatim"] is False
    assert any("not verbatim" in f for f in results["failures"])


def test_conflicting_deadlines_flags_needs_review():
    source_text = "कृषी विभाग, महाराष्ट्र शासन"
    fields = {
        "name": "पीक योजना",
        "department": "कृषी विभाग, महाराष्ट्र शासन",
        "eligibility": "शेतकरी",
        "benefits": "अनुदान",
        "deadlines": ["31 July 2026", "15 August 2026", "30 September 2026"],  # 3 conflicting dates
    }
    evidence_spans = {
        "name": "कृषी विभाग, महाराष्ट्र शासन",
        "department": "कृषी विभाग, महाराष्ट्र शासन",
        "eligibility": "कृषी विभाग, महाराष्ट्र शासन",
        "benefits": "कृषी विभाग, महाराष्ट्र शासन",
    }
    status, results = validate_extraction_rules(fields, evidence_spans, source_text)
    assert status == "Needs review"
    assert results["deadlines_valid"] is False
