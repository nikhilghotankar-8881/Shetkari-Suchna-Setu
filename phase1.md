# phase1.md — Foundation + Sources

**Goal:** everything downstream have ground to stand on.

## Tasks
- [ ] Repo + branches + CI (lint, `pip-audit`, `npm audit`, gitleaks).
- [ ] FastAPI skeleton + health endpoint. React/Vite skeleton.
- [ ] Postgres up. Migrations for tables in arcitechture.md.
- [ ] Deploy hello-world to public HTTPS URL (find hosting pain now, not D-1).
- [ ] **Pick 3–5 sources.** Score each: format (HTML/PDF/RSS), update frequency, language, robots/ToS, scanned?, importance. Pick by monitorability first.
- [ ] Collect 10+ real notices as fixtures. Hand-label fields (name, dept, eligibility, deadline, region).
- [ ] Settle prep.md open questions 1–6.
- [ ] Secrets setup: env vars, `.gitignore`, no keys in repo.

## Deliverables
Running skeleton at public URL. `sources` table seeded. Fixture folder + labels. Source scoring table in repo.

## Exit criteria
- Skeleton reachable on phone over HTTPS.
- Each chosen source: fetch by hand succeed, format known, mode (auto/manual) decided.
- Fixtures cover Marathi + English if sources need it.

## Risks
Source ToS/robots forbid fetch → swap source or mark manual.
