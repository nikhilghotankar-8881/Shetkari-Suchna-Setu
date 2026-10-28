# phase2.md — Monitoring + Change Detection

**Goal:** system notice when official source change.

## Tasks
- [ ] Scheduler + per-source poll interval, jitter, backoff.
- [ ] Fetcher: robots check, User-Agent, conditional GET, store raw + headers.
- [ ] Normalizer: HTML clean, PDF text, Devanagari digit handling, `needs_ocr` flag.
- [ ] Hash + `snapshots` + `notice_versions` + diff storage.
- [ ] Noise filter: ignore whitespace/format-only diffs.
- [ ] Source health: last_checked, last_changed, error count.
- [ ] Manual-source path: admin submit URL/file → same pipeline.
- [ ] Seeded-change test harness: edit local copy of a notice → expect `changed` version.

## Deliverables
Pipeline that turn source into versioned snapshots. Diff viewable via API.

## Exit criteria
- 3+ sources polled on schedule without manual poke.
- Seeded change detected; no-change poll creates no version.
- Source failure surface as health=red, not silent.
- Dupe poll idempotent.

## Risks
Dynamic JS pages (need headless browser — avoid, pick other source). Page noise → false change. Rate-limit/blocked IP.

## Honesty note
Detection latency = poll interval. Record it. Show it in demo.
