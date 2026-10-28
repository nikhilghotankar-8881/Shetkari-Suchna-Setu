# tech.md — Stack

| Layer | Choice | Why | Watch out |
|-------|--------|-----|-----------|
| Frontend | React + Vite, Tailwind | Fast, one codebase for farmer + admin | Keep bundle small; code-split admin |
| PWA | Web manifest + service worker | Installable, cached cards | Offline/push not automatic; test before claiming |
| Backend | Python 3.11+, FastAPI | Fast to build; fits scraping + AI libs | Async fetch; timeouts |
| DB | PostgreSQL (Supabase or managed PG) | Relational fits versioning | Enable RLS if Supabase; backups |
| Scheduler | APScheduler or host cron | Simple polling | Idempotent jobs; one-runner guard |
| Fetch | `httpx`, `trafilatura`/`BeautifulSoup` | HTML → text | Respect robots.txt, rate limit, User-Agent |
| PDF | `pdfplumber` / `pypdf`; OCR (Tesseract, mr+en) only if needed | Text PDFs | OCR = extra time + errors |
| Extraction | Rules/regex first, LLM API second | Cheap + reliable first | Devanagari numerals, Marathi dates |
| Diff | `difflib` / `diff-match-patch` | Human-readable changes | Normalize first |
| Validation | Pydantic schemas + custom rules | Schema enforce | — |
| Auth | Supabase Auth or `fastapi-users` (admin only) | Don't hand-roll | See authentication.md |
| Hosting | Render/Railway/Fly (API) + Vercel/Netlify (UI) | Public link fast | HTTPS default; set region near IN if possible |
| Monitoring | Structured logs, health endpoint | Admin sees source health | No PII in logs |

## Not using
- Blockchain: no solve change-detect or deadline-correctness.
- Native app: later if justified.
- Vector DB / RAG: not needed for MVP.
- Message queue (Kafka etc): overkill. DB-backed job table enough.

## LLM use rules
- Input: public notice text only.
- Output: JSON schema (name, dept, eligibility, benefits, documents, deadlines[], evidence_quotes[]).
- Temp low. Prompt version stored with every extraction.
- Pin model version; log it.
- Cost cap: extract only on new/changed version, not every poll.

## Testing minimum
- Fixture set: 10+ real notices (mr + en, HTML + PDF) with hand-labelled fields.
- Measure: extraction field accuracy, false-alert rate, detection of seeded change.
- Demo-able test: edit a notice copy → system detect → alert appear.
