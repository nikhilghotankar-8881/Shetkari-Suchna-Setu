# Shetkari Suchna-Setu — Master Phase Plan & Integration Roadmap

This document outlines the systematic, phase-wise execution plan to complete the product, verify all integration touchpoints, and achieve demo/production readiness.

---

## Part 1: Phase-Wise Implementation Plan

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ROADMAP TO 100% COMPLETION                      │
├─────────┬──────────────────────────┬───────────────────────────────────┤
│ Phase   │ Focus Area               │ Key Milestone                     │
├─────────┼──────────────────────────┼───────────────────────────────────┤
│ Phase A │ Live DB Seeding & Schema │ Real notices in Supabase; schema  │
│         │ Alignment                │ parity with React UI components   │
├─────────┼──────────────────────────┼───────────────────────────────────┤
│ Phase B │ Full Client-API Handshake│ Decouple mockData.js; live token  │
│         │ & Auth Sync              │ exchange & farmer persistence     │
├─────────┼──────────────────────────┼───────────────────────────────────┤
│ Phase C │ Pipeline Automation &    │ Automated background scheduler    │
│         │ Crawling                 │ (APScheduler) + source health     │
├─────────┼──────────────────────────┼───────────────────────────────────┤
│ Phase D │ Admin Action $\rightarrow$ Farmer│ Admin "Approve" triggers instant  │
│         │ Reactive Alerts          │ in-app alert via set intersection │
├─────────┼──────────────────────────┼───────────────────────────────────┤
│ Phase E │ Demo Script Hardening &  │ Seeded change dry run, offline    │
│         │ Fallback Packages        │ assets, limits disclosure slide   │
└─────────┴──────────────────────────┴───────────────────────────────────┘
```

---

### Phase A: Live Database Seeding & Schema Parity
**Objective:** Replace empty database lists (`[]`) with authoritative, real-world Maharashtra agricultural circulars and match the frontend UI property names.

- [ ] **Task A.1 — Real Maharashtra Notice Fixture Seed Script:**
  - Create `backend/app/services/seed_notices.py` to populate initial circulars into `sources`, `notices`, `notice_versions`, `extractions`, `verifications`, and `schemes`.
  - Include key schemes:
    1. *MahaDBT Farm Mechanization (Tractor & Implement Subsidy)*
    2. *Bhausaheb Fundkar Horticulture Plantation Scheme*
    3. *PMFBY Kharif Crop Insurance Enrollment Guidelines*
    4. *Micro-Irrigation (Drip/Sprinkler) Subsidy*
    5. *Cotton & Soybean Price Deficit Assistance*
- [ ] **Task A.2 — Bilingual Response Schema Parity:**
  - Update `backend/app/schemas/notice.py` and `backend/app/routers/public.py` so `/api/v1/schemes` returns both Marathi and English properties (`name_mr`, `name_en`, `department_mr`, `department_en`, `eligibility_mr`, `eligibility_en`, `benefits_mr`, `benefits_en`, `verification_status`) expected by `frontend/src/farmer/schemes/SchemeCard.jsx`.
- [ ] **Exit Criteria:** Visiting `http://localhost:3000/schemes` renders live records directly fetched from Supabase PostgreSQL without relying on mock data.

---

### Phase B: Full Client-API Handshake & Token Integration
**Objective:** Transition frontend state management to live backend endpoints.

- [ ] **Task B.1 — Farmer Profile Token Handshake:**
  - Verify `frontend/src/farmer/onboarding/OnboardingFlow.jsx` submits to `POST /api/v1/profile` and captures the 256-bit opaque bearer token in browser storage (`localStorage` / secure cookie).
  - Ensure subsequent requests include the `X-Profile-Token` header.
- [ ] **Task B.2 — Admin JWT Session Handshake:**
  - Verify `frontend/src/admin/login/LoginPage.jsx` submits credentials to `POST /api/v1/admin/login`, saves the returned JWT, and attaches `Authorization: Bearer <token>` to all administrative actions.
- [ ] **Task B.3 — Graceful Fallback Mode:**
  - In `frontend/src/api/client.js`, ensure mock data is treated strictly as an offline contingency fallback, logging an explicit console notice when active.
- [ ] **Exit Criteria:** Changing farmer district/crops updates the `profiles` table in Supabase. Admin login succeeds with live JWT authentication.

---

### Phase C: Pipeline Automation & Crawling
**Objective:** Establish autonomous monitoring for official government portals.

- [ ] **Task C.1 — APScheduler In-Memory Loop:**
  - Configure `APScheduler` inside `backend/app/main.py` lifespan to run every minute.
  - Query: `SELECT * FROM sources WHERE mode='auto' AND next_poll_at <= now()`.
  - Trigger `fetch_source_content` with conditional GET (`ETag`, `If-Modified-Since`).
- [ ] **Task C.2 — Source Health Reporting:**
  - If a government site times out or changes structure, transition `health` from `green` to `yellow`/`red` and record `last_error`.
- [ ] **Exit Criteria:** Admin dashboard reflects accurate `last_checked_at` timestamps and source health without manual intervention.

---

### Phase D: Admin Verification $\rightarrow$ Reactive In-App Alerts
**Objective:** Close the human-in-the-loop validation cycle.

- [ ] **Task D.1 — Review Queue Interface:**
  - Verify `http://localhost:3000/admin/review` displays pending notices with side-by-side evidence quotes and source text snippets.
- [ ] **Task D.2 — Live Verification Action:**
  - On clicking "Approve", call `POST /api/v1/admin/review/{version_id}` with `status="Verified"`.
  - Check that the `schemes` table sets the verified deadline and updates `last_verified_at`.
- [ ] **Task D.3 — Idempotent Alert Delivery:**
  - Verify the matching algorithm (`matcher.py`) identifies farmers with overlapping district and crop profiles and inserts rows into `alerts`.
  - Confirm the unread notification badge lights up in the farmer UI (`http://localhost:3000/alerts`).
- [ ] **Exit Criteria:** A verified deadline change in the admin portal immediately generates an inbox alert for matching farmers and zero alerts for non-matching farmers.

---

### Phase E: Security Hardening & Demo Dry-Run
**Objective:** Verify compliance with data privacy standards and prepare demonstration assets.

- [ ] **Task E.1 — DPDP Hard-Delete Test:**
  - Execute "Delete My Data" from `http://localhost:3000/profile` and verify that the `profiles` row and all associated `alerts` are permanently purged from Supabase.
- [ ] **Task E.2 — Two Seeded Demo Scenarios:**
  - Scenario 1 (New Scheme): State-wide subsidy detected $\rightarrow$ human approval $\rightarrow$ broadcast alert.
  - Scenario 2 (Deadline Extension): Kharif insurance deadline extended $\rightarrow$ diff highlighted in red/green $\rightarrow$ urgent alert to affected crop growers.
- [ ] **Task E.3 — Submission Assets:**
  - Document limitations clearly (poll latency, manual fallback for scanned PDFs, no automated claim filing).

---

## Part 2: Human Execution vs. AI Responsibility Matrix

This matrix details what can be implemented programmatically by the assistant versus real-world actions required by you.

| Domain | What AI / Code Can Build | What Requires Human Action |
|---|---|---|
| **Government Scraping & ToS** | Fetch engines, User-Agent headers, conditional requests, robots.txt parsers, and HTML/PDF normalizers. | **Permission & Compliance:** Verifying that specific government URLs permit automated indexing, checking CAPTCHAs, or acquiring official API keys if a portal mandates them. |
| **Authentication & Secrets** | Token generators, bcrypt hashing, JWT issuance, RBAC checks, and `.env` bindings. | **Credential Management:** Managing your production Supabase database password, rotating leaked JWT secrets, and provisioning multi-factor authentication (TOTP apps). |
| **Domain & Hosting** | Dockerfiles, CORS configurations, security middleware, and reverse proxy routes. | **Deployment Infrastructure:** Registering custom domain names (`.gov.in` / `.in`), configuring DNS records, setting up cloud hosting accounts (Vercel, Render, Railway, AWS). |
| **Ground-Truth Data** | Data models, migration scripts, and seed insertion scripts. | **Official Circular Curation:** Sourcing actual PDF government resolutions from the Maharashtra Gazette or Krishi Vibhag to serve as real ground-truth benchmarks. |
| **Human Review Gate** | Review queue UI, side-by-side diff displays, approval endpoints, and audit logging. | **Manual Approval Decisions:** Acting as the designated agricultural officer or reviewer who inspects the PDF and clicks "Approve". |
| **Field Devices & User Testing** | Mobile-first CSS, viewport testing, and browser simulations. | **Physical Device QA:** Testing the interface on physical low-cost Android phones over 3G/4G connections under outdoor sunlight conditions. |
