from app.services.normalizer import convert_devanagari_digits, normalize_html, normalize_source_text


def test_convert_devanagari_digits():
    marathi_date = "३१ जुलै २०२६"
    converted = convert_devanagari_digits(marathi_date)
    assert converted == "31 जुलै 2026"

    digits_all = "०१२३४५६७८९"
    assert convert_devanagari_digits(digits_all) == "0123456789"


def test_normalize_html_removes_scripts_nav():
    sample_html = """
    <html>
      <head>
        <title>Govt Notice</title>
        <script>console.log("tracker");</script>
        <style>.ad { color: red; }</style>
      </head>
      <body>
        <nav><a href="/">Home</a></nav>
        <main>
          <h1>पीक विमा योजना २०२६</h1>
          <p>अर्ज सादर करण्याची अंतिम मुदत ३१ जुलै २०२६ आहे.</p>
        </main>
        <footer>Copyright 2026</footer>
      </body>
    </html>
    """
    cleaned = normalize_html(sample_html)
    assert "tracker" not in cleaned
    assert "Copyright" not in cleaned
    assert "Home" not in cleaned
    assert "पीक विमा योजना २०२६" in cleaned
    assert "अंतिम मुदत ३१ जुलै २०२६" in cleaned
