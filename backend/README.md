# Shetkari Suchna-Setu — Backend API

Authoritative government agricultural notices & verified scheme alerts for farmers across Maharashtra.

## Architectural Pillars
- **Zero-PII Farmer Profile**: No passwords, no phone numbers, no names. Authenticated via a 256-bit opaque bearer token (`SHA-256` stored on server).
- **Hard Truth / Honest Deadlines**: Deadlines are **never** displayed to farmers unless marked `Verified` by human review. Unverified entries show `"Not yet verified"`.
- **Verbatim Evidence Verification**: Every extracted field must map directly to an unaltered verbatim quote in the original government notice text.
- **Append-only Tamper-Evident Versioning**: Notices and crawled snapshots are never overwritten in-place; revisions are captured as versioned diffs.

---

## Directory Structure
```
backend/
├── app/
│   ├── main.py              # FastAPI application & security middleware
│   ├── config.py            # Pydantic BaseSettings & env configs
│   ├── database.py          # Async SQLAlchemy engine & session factory
│   ├── models/              # Declarative DB models (PostgreSQL/SQLite)
│   │   ├── source.py        # Monitored govt portals registry
│   │   ├── snapshot.py      # Immutable crawl captures & content hashes
│   │   ├── notice.py        # Notices & revisions
│   │   ├── extraction.py    # Structured extractions & verification rules
│   │   ├── profile.py       # Anonymous farmer profiles (zero-PII)
│   │   ├── alert.py         # In-app notifications
│   │   ├── audit.py         # Append-only administrative audit log
│   │   └── user.py          # Admin users with RBAC
│   ├── schemas/             # Pydantic v2 schemas
│   ├── core/
│   │   ├── security.py      # Token generation, SHA-256 hashing, JWTs
│   │   └── dependencies.py  # Farmer bearer token & admin RBAC dependencies
│   ├── services/
│   │   ├── fetcher.py       # Polite async HTTP fetcher (conditional GET)
│   │   ├── normalizer.py    # HTML cleaner, Devanagari numerals converter
│   │   ├── detector.py      # Content hashing & unified diffs
│   │   ├── validator.py     # Deterministic safety & quote verification rules
│   │   └── matcher.py       # Region & crop overlap matching
│   └── routers/
│       ├── health.py        # /health endpoint
│       ├── public.py        # /api/v1/schemes, /api/v1/sources
│       ├── farmer.py        # /api/v1/farmer/profile, /api/v1/farmer/alerts
│       └── admin.py         # /api/v1/admin/* (review queue, audit, metrics)
├── tests/
│   ├── fixtures/            # Labeled real notices (Marathi & English)
│   ├── test_normalizer.py   # Devanagari & HTML cleaning tests
│   ├── test_detector.py     # Content hash & diff tests
│   ├── test_validator.py    # Verbatim quote & deadline sanity tests
│   ├── test_matcher.py      # Region & crop filtering tests
│   ├── test_auth_and_security.py # Token hash & JWT tests
│   └── test_api_endpoints.py    # End-to-end API tests
├── requirements.txt
├── start.py
└── .env.example
```

---

## Quickstart

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
python start.py
# Server starts at http://localhost:8000
# OpenAPI Docs available at http://localhost:8000/docs
```

### 4. Run Test Suite
```bash
pytest -v
```

---

## Key API Endpoints

### Public
- `GET /health` — Health check & DB connection status
- `GET /api/v1/sources` — List of monitored government portals
- `GET /api/v1/schemes` — Public verified/auto-checked schemes catalog

### Farmer (Anonymous Bearer Token)
- `POST /api/v1/farmer/profile` — Onboard farmer (returns single-issuance 256-bit token & sets HttpOnly cookie)
- `GET /api/v1/farmer/profile` — Retrieve own profile
- `GET /api/v1/farmer/schemes` — Retrieve schemes potentially relevant to farmer's district & crops
- `GET /api/v1/farmer/alerts` — Farmer's in-app notification inbox
- `PATCH /api/v1/farmer/alerts/{id}/read` — Mark notification read
- `DELETE /api/v1/farmer/profile` — DPDP compliance: hard delete profile & all alerts

### Admin (Secured with RBAC JWT)
- `POST /api/v1/admin/login` — Login with email/password; returns short-lived JWT
- `GET /api/v1/admin/sources` — View all monitored sources & health indicators
- `POST /api/v1/admin/sources/{id}/poll` — Trigger manual crawl & change detection
- `GET /api/v1/admin/review-queue` — Review pending extractions with side-by-side evidence quotes
- `POST /api/v1/admin/review/{version_id}` — Human sign-off (`Verified`, `Rejected`, `Superseded`); triggers alert generation if verified
- `GET /api/v1/admin/audit-logs` — Immutable audit ledger
- `GET /api/v1/admin/metrics` — Dashboard metrics (healthy sources, queue length, etc.)
