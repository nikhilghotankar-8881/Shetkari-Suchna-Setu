# pipeline.md — Monitoring → Alert Pipeline

```
FETCH → NORMALIZE → HASH/DIFF → EXTRACT → VALIDATE → REVIEW → PUBLISH → MATCH → ALERT
```

## 1. Fetch
- Per-source poll interval (default 6h; tune per source). Jitter. Backoff on error.
- Check robots.txt. Descriptive User-Agent + contact.
- Store raw bytes, status, headers (ETag/Last-Modified → conditional GET).
- Source `mode=manual` → admin pastes URL/file; pipeline continues from step 2. Labelled **manual** in UI.

## 2. Normalize
- HTML: drop nav/footer/scripts/counters/dates-of-page-render.
- PDF: text extract; if empty text → flag `needs_ocr` (manual review in MVP unless OCR built).
- Unicode NFC. Convert Devanagari digits → ASCII for comparison (keep original for display).

## 3. Change detect
- Hash(normalized text). Same as last → update `last_checked_at`, stop.
- Different → compute diff, create `notice_version` (`new` if first, else `changed`).
- Tiny diff (whitespace/formatting only) → log, no alert.
- Seeded-change test must pass (phase2 exit).

## 4. Extract
- Parsers/regex for dates, amounts, scheme IDs first.
- LLM fills rest. Schema-constrained. Must return `evidence_quote` per field.
- Prompt injection guard: notice text inside delimiters; instruction to ignore embedded commands; no tools; output validated by schema anyway.

## 5. Validate (rules)
| Rule | Fail → |
|------|--------|
| Every field has evidence quote | Needs review |
| Quote appears verbatim in normalized source | Needs review |
| Dates parse; deadline ≥ publish date; not absurdly far | Needs review |
| Deadline conflict across multiple mentions | **Conflicting** → Needs review |
| Region in notice ⊆ known districts | Needs review |
| Changed notice: deadline/eligibility changed | Force human review, high priority |
| Low LLM confidence / missing required fields | Needs review |

Pass all → `Auto-checked`. **Never auto-Verified.** Human click = Verified.
Deadline shown to farmers only at Verified.

## 6. Review (admin)
- Queue sorted: changed-deadline > new > rest.
- Reviewer sees source snippet + extracted value side by side.
- Actions: approve, edit+approve, reject, mark superseded. Logged in audit.
- Capacity risk: reviewers are the bottleneck. Keep source count small.

## 7. Publish
- Verified/Auto-checked version → visible to farmers. Previous version → Superseded.

## 8. Match
- Notice region ∩ profile district/taluka (empty region = state-wide).
- Notice crops ∩ profile crops (empty crops = all).
- Output = **"potentially relevant"**, never "eligible". Eligibility = official portal decision.

## 9. Alert
- One alert per (profile, notice_version). Idempotent (unique key).
- Kinds: `NEW`, `CHANGED`, `DEADLINE_VERIFIED`, `WITHDRAWN`.
- Admin preview before first publish of a notice.
- Rate-limit per profile (no spam).

## Metrics (show in admin)
- Sources healthy / total. Last successful check per source.
- Detection → publish time (median).
- Review queue length. False-alert count (rejected after alert).

## Honest limits
Detection speed = poll interval + feed support. No instant claims.
