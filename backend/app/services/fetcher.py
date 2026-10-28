import httpx
from typing import Optional, Tuple
from app.services.normalizer import normalize_source_text

DEFAULT_USER_AGENT = (
    "ShetkariSuchnaSetu-Bot/1.0 (+https://github.com/nikhilghotankar-8881/Shetkari-Suchna-Setu; "
    "contact: admin@shetkari-setu.gov.in)"
)


async def fetch_source_content(
    url: str,
    etag: Optional[str] = None,
    last_modified: Optional[str] = None,
    timeout_sec: float = 15.0,
) -> Tuple[int, Optional[str], Optional[str], str, str]:
    """
    Politely fetches a government source portal with conditional GET headers.
    Returns:
      (http_status, new_etag, new_last_modified, raw_content, normalized_text)
    """
    headers = {
        "User-Agent": DEFAULT_USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "mr,en;q=0.9",
    }
    if etag:
        headers["If-None-Match"] = etag
    if last_modified:
        headers["If-Modified-Since"] = last_modified

    async with httpx.AsyncClient(timeout=timeout_sec, follow_redirects=True) as client:
        response = await client.get(url, headers=headers)

        new_etag = response.headers.get("ETag")
        new_last_modified = response.headers.get("Last-Modified")

        if response.status_code == 304:
            # Source not modified on server
            return 304, new_etag, new_last_modified, "", ""

        raw_content = response.text
        is_html = "html" in response.headers.get("Content-Type", "html").lower()
        normalized_text = normalize_source_text(raw_content, is_html=is_html)

        return response.status_code, new_etag, new_last_modified, raw_content, normalized_text
