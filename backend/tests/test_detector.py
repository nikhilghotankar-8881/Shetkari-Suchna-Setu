from app.services.detector import compute_content_hash, compute_text_diff, is_significant_change


def test_hash_consistency():
    text1 = "शेतकरी सूचना सेतू"
    text2 = "शेतकरी सूचना सेतू"
    assert compute_content_hash(text1) == compute_content_hash(text2)


def test_seeded_change_detection():
    old_version = (
        "कृषी विभाग, महाराष्ट्र शासन\n"
        "अर्ज करण्याची अंतिम मुदत: ३१ जुलै २०२६.\n"
        "लाभ: १००% अनुदान."
    )
    # Seeded change: deadline extended to 15 August
    new_version = (
        "कृषी विभाग, महाराष्ट्र शासन\n"
        "अर्ज करण्याची अंतिम मुदत: १५ ऑगस्ट २०२६.\n"
        "लाभ: १००% अनुदान."
    )

    has_changed, diff_text = is_significant_change(old_version, new_version)
    assert has_changed is True
    assert diff_text is not None
    assert "३१ जुलै २०२६" in diff_text
    assert "१५ ऑगस्ट २०२६" in diff_text


def test_no_change_when_identical():
    text = "अंतिम मुदत ३१ जुलै २०२६"
    has_changed, diff = is_significant_change(text, text)
    assert has_changed is False
    assert diff is None
