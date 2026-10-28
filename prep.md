# prep.md — Shetkari SuchnaSetu: Prep

## One-line
Mobile-first web app. Farmer pick district + crops → see relevant govt schemes, crop-insurance info, new/changed notices, deadlines (only if verified), official links. Backend watch official sources, detect change, extract, verify, match, alert.

## Decision (locked)
- Mobile-first **web app** (PWA-ready). NOT native Android for prototype.
- Why: deadline close, no install, central deploy.
- Two UIs: **Farmer Dashboard**, **Admin Dashboard**.

## Core innovation (demo this, nothing else matter more)
Official notice change → system detect → extract + verify → match affected farmers → actionable alert + traceable official source.

## Flow
Govt sources → monitor → change detect → AI extract → verify → profile match → dashboard/alerts → official portal

## Non-goals (say no)
- No claim submit, no insurance filing, no apply-on-behalf.
- No all-Maharashtra scheme coverage.
- No blockchain.
- No "instant detection" promise. Speed = poll frequency + source feed support.
- No SMS/WhatsApp in MVP (later, if feasible).

## MVP = 5 working things
1. Mobile-friendly farmer dashboard.
2. Small set of **real** notices from authoritative sources.
3. Detect new/modified notices in selected sources.
4. Scheme cards: source link, dates, verification status.
5. Profile filter + in-app alert generation.

## Honesty rules (product-level)
- Deadline shown only when status = Verified. Else "Not yet verified".
- Source that cannot be auto-monitored → label **manual**. Never fake automation.
- Example notices in UI mock = labelled illustrative.
- Every card: source link + last-verified date.

## Open questions — decide in week 1 (these break plan if left open)
| # | Question | Why matter | Default if no answer |
|---|----------|-----------|----------------------|
| 1 | Which 3–5 sources? | Everything downstream depend on source format (HTML/PDF/RSS) | Pick by monitorability, not importance |
| 2 | Notice language? Marathi/English/both | Extraction, UI, Devanagari numerals | UI Marathi+English; extractor test on both |
| 3 | PDFs scanned or text? | Scanned = OCR = more time | Prefer text-PDF sources for MVP |
| 4 | Do sources allow automated fetch? (robots/ToS) | Legal + ethical | Respect robots.txt; low poll rate; descriptive User-Agent |
| 5 | Alert without account — how? | Alerts need persistent profile | Anonymous profile ID (see authentication.md) |
| 6 | Who verify, how many reviewers? | Verification is bottleneck | 2 reviewers; reviewer queue in admin |

## File map
prep → design → arcitechture → tech → pipeline → authentication → privacy → encryption → plan → phase1..6
