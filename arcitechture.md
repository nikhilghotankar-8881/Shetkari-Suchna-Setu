# arcitechture.md — System Architecture

## Components
```
[Govt sources] → [Fetcher/Scheduler] → [Snapshot store]
                         ↓
                 [Change detector] → [Extractor (LLM + parsers)]
                         ↓
                  [Validator rules] → [Review queue (admin)]
                         ↓
                    [Notices DB] → [Matcher] → [Alerts]
                         ↓                        ↓
                 [FastAPI REST API] ←——→ [React: Farmer UI + Admin UI]
```

## Services (single deployable for MVP)
| Part | Job |
|------|-----|
| Fetcher | Scheduled poll per source. Store raw bytes + headers + fetched_at |
| Normalizer | HTML/PDF → clean text. Strip noise (counters, timestamps, nav) |
| Change detector | Content hash on normalized text; diff vs previous snapshot |
| Extractor | Parser first, LLM second. Schema-constrained JSON out |
| Validator | Rules (see pipeline.md). Output status + reasons |
| Matcher | Notice ↔ profile (district, taluka, crop) |
| Alert generator | Row per (profile, notice-version) |
| API | FastAPI. Public read endpoints + authed admin endpoints |
| Frontend | React. Farmer routes public. Admin routes behind auth |

Keep monolith. Split later only if justified.

## Data model (core tables)
- `sources(id, name, url, kind[html|pdf|rss], mode[auto|manual], poll_minutes, robots_ok, last_checked_at, last_changed_at, health)`
- `snapshots(id, source_id, fetched_at, http_status, content_hash, raw_ref, text_ref)`
- `notices(id, source_id, title, canonical_url, first_seen_at)`
- `notice_versions(id, notice_id, snapshot_id, version_no, content_hash, change_type[new|changed], diff_ref)`
- `extractions(id, notice_version_id, fields_json, evidence_spans_json, model, prompt_ver, confidence, created_at)`
- `verifications(id, notice_version_id, status, rule_results_json, reviewer_id, reviewed_at, note)`
- `schemes(id, name, department, ...)` ← derived from verified extractions
- `profiles(id, district, taluka, crops[], lang, created_at, last_seen_at)`  ← no name, no phone in MVP
- `alerts(id, profile_id, notice_version_id, kind, created_at, read_at)`
- `audit_log(id, actor, action, target, at)`

Versioning is key: never overwrite. Keep every version + snapshot → traceability.

## Key design calls (with counter-argument)
1. **Hash change detection** — cheap, but false positives from page noise. Mitigate: normalize before hash; diff before alert; admin sees diff.
2. **LLM extraction** — flexible, but can hallucinate dates. Mitigate: output must include evidence quote; validator check quote exists verbatim in source text; deadline never auto-verified.
3. **Single Postgres** — enough. Supabase gives Auth + RLS + managed encryption at rest. Tradeoff: vendor coupling; accept for hackathon.
4. **Polling not push** — most govt sites offer no feed. Detection latency = poll interval. State this in UI/docs.
5. **Alerts in-app** — no delivery infra. Cheapest honest option.

## Failure modes to design for
- Source down / layout change → fetch error, health=red, admin alert. Not silent.
- Source layout change breaks parser → fall back to whole-page text + manual review.
- LLM API down → queue, retry, notice stays "pending extraction".
- Duplicate notice (same content, new URL) → dedupe by content hash + title similarity.
- Notice withdrawn → mark superseded/withdrawn, alert affected profiles.

## Trust boundary
Notice text = **untrusted input** (prompt injection risk). Extractor has no tools, no network, schema-only output. Farmer data never sent to LLM. See privacy.md.
