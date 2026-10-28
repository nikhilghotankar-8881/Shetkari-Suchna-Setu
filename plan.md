# plan.md — Master Plan

Deadline unknown to this doc → plan in **relative days (D1…Dn)**. Fill real dates once confirmed.

## Phases
| Phase | Goal | Output | File |
|-------|------|--------|------|
| 1 | Foundation + source selection | Repo, DB, 3–5 sources chosen, fixtures | phase1.md |
| 2 | Monitoring + change detection | Fetch, normalize, hash, diff working | phase2.md |
| 3 | Extraction + verification | Extractor, validator, review states | phase3.md |
| 4 | Farmer dashboard + matching | Profile, scheme cards, updates, insurance | phase4.md |
| 5 | Admin dashboard + alerts | Review UI, source health, in-app alerts | phase5.md |
| 6 | Security, hardening, demo, submit | Checklists passed, demo script, deploy | phase6.md |

## Critical path
Sources chosen → fetch works → change detect works → extraction + validation → matching → alert shown.
Farmer UI + admin UI can run parallel after Phase 2 data model fixed.

## Suggested split (adjust to team size)
- Backend/pipeline: phases 2, 3
- Frontend farmer: phase 4
- Frontend admin + auth: phase 5
- Security/privacy/docs/demo: phase 1 (docs), 6

## Cut line (if time short, drop in this order)
1. Offline/PWA caching extras
2. Marathi/English toggle polish (keep Marathi default only if sources Marathi)
3. Taluka-level matching (keep district)
4. OCR
5. Edit-in-review (keep approve/reject)
Never drop: change detection, evidence-based verification, source links, verified-only deadlines, auth on admin.

## Top risks
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Sources not machine-friendly | No automation | Choose monitorable sources early; label manual honestly |
| Marathi / scanned PDFs | Extraction fail | Test fixtures D1–D2; prefer text PDFs |
| LLM wrong deadline | Farmer harm | Evidence quote + validator + human verify |
| Reviewer bottleneck | Stale data | Few sources; priority queue |
| False-positive alerts | Trust loss | Normalize before hash; diff gate; preview |
| Scope creep | Miss deadline | Non-goals list in prep.md |
| Legal/ToS on scraping | Block / liability | robots.txt, low rate, official sources only |

## Definition of done (submission)
- [ ] Public HTTPS link works on a phone.
- [ ] Real notices from real sources in DB.
- [ ] Live demo: change a notice → detect → review → farmer alert.
- [ ] Every card: source link, last-verified, badge.
- [ ] Admin behind MFA auth.
- [ ] privacy.md + encryption.md checklists done.
- [ ] Limits slide: poll-interval latency, manual sources, no claims filing.
