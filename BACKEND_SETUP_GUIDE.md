# Shetkari Suchna-Setu: Complete Backend Setup & Architecture Guide

A step-by-step, from-scratch guide explaining the **WHAT, WHERE, WHY, and WHEN** of every component, how to set up the virtual environment, connect your database (SQLite or Supabase/PostgreSQL), and integrate official Maharashtra government portals and APIs.

---

## 1. The Core Architecture (WHAT, WHERE, WHY, WHEN)

### 📌 WHAT is this Backend?
A **FastAPI monolith** designed for high honesty, tamper-evident document versioning, and zero-PII privacy. It has two distinct operational modes:
1. **The Autonomous Pipeline (Background):** Monitors official government portals, detects content changes, normalizes text (handling Devanagari numerals), extracts structured scheme information with exact source evidence quotes, validates safety rules, and queues notices for human review.
2. **The REST API (Online):** Serves anonymous mobile-first farmer interfaces and privileged role-based admin workflows.

---

### 📌 WHERE is Everything Located?
```
d:/PythonProjects/Shetkari-Suchna-Setu/backend/
├── .env                      # Active environment variables (Database, JWT, Ports)
├── requirements.txt          # Python library dependencies
├── start.py                  # Server launcher script
├── app/
│   ├── main.py              # Application entrypoint, CORS, security headers & lifespan
│   ├── config.py            # Pydantic settings loading from .env
│   ├── database.py          # Asynchronous SQLAlchemy database engine & session maker
│   ├── models/              # Database schema tables
│   │   ├── source.py        # 'sources': Monitored government URLs & health states
│   │   ├── snapshot.py      # 'snapshots': Raw HTML/PDF bytes & content hashes
│   │   ├── notice.py        # 'notices' & 'notice_versions': Immutable revision history
│   │   ├── extraction.py    # 'extractions' & 'verifications': Evidence quotes & review states
│   │   ├── scheme.py        # 'schemes': Published farmer-facing view (Zero-leak deadlines)
│   │   ├── profile.py       # 'profiles': Anonymous farmer preferences (district, crops)
│   │   ├── alert.py         # 'alerts': Idempotent in-app inbox
│   │   ├── audit.py         # 'audit_log': Append-only administrator audit ledger
│   │   └── user.py          # 'users': Admin accounts with RBAC (viewer, reviewer, admin)
│   ├── schemas/             # Pydantic v2 input/output validation models
│   ├── core/
│   │   ├── security.py      # 256-bit token generator, SHA-256 blind hashing, JWT tokens
│   │   └── dependencies.py  # Farmer bearer token & admin RBAC auth dependencies
│   ├── services/
│   │   ├── fetcher.py       # Polite async HTTP client with conditional GET (ETag)
│   │   ├── normalizer.py    # HTML cleaner & Devanagari numeral (०-९ -> 0-9) translator
│   │   ├── detector.py      # SHA-256 content hashing & unified diff generator
│   │   ├── validator.py     # Verbatim quote checker & date sanity rules
│   │   └── matcher.py       # Region & crop relevance matcher
│   └── routers/
│       ├── health.py        # /health endpoint
│       ├── public.py        # /api/v1/schemes, /api/v1/sources, /api/v1/insurance
│       ├── farmer.py        # /api/v1/farmer/profile, /api/v1/farmer/alerts
│       └── admin.py         # /api/v1/admin/* (sources, review queue, audit, metrics)
└── tests/                   # Complete automated test suite & real Marathi/English fixtures
```

---

### 📌 WHY are These Architectural Choices Mandatory?
1. **Why Append-Only Versioning instead of updating rows?**
   - Official government circulars and scheme deadlines change frequently (e.g., Kharif registration deadline extensions). By never using `UPDATE` on notices, the system maintains an irrefutable, tamper-evident audit trail showing what the source stated on every date.
2. **Why is `schemes.deadline` strictly `NULL` until `Verified`?**
   - LLMs can easily hallucinate dates or confuse circular publication dates with scheme deadlines. To prevent misleading farmers, the database table that feeds the farmer UI literally leaves the deadline column as `NULL` until a human clicks "Approve". Unverified notices explicitly render `"Not yet verified"`.
3. **Why Anonymous Farmer Profiles with 256-bit Token Hashes?**
   - India's Digital Personal Data Protection (DPDP) standards require data minimization. Farmers are not asked for Aadhaar, phone numbers, passwords, or bank records. They receive a 256-bit random opaque token, and the database stores only `SHA-256(token)`. If the device is lost, re-onboarding takes 3 taps.
4. **Why Devanagari Numeral Conversion (`text_compare` vs `text_display`)?**
   - Government portals in Maharashtra often mix Marathi Devanagari numerals (`३१ जुलै २०२६`) and English digits (`31 July 2026`). Converting Devanagari to ASCII digits in `text_compare` allows deterministic regex extraction and diffing without corrupting the native `text_display`.

---

### 📌 WHEN Does Each Component Run?
* **On Server Startup:** `lifespan` in `app/main.py` runs, connects to the database, provisions all missing tables, and seeds the default admin user and initial government sources if empty.
* **On Background Interval:** The fetcher checks sources whose poll interval has elapsed (`next_poll_at <= now()`), compares hashes, and queues any detected changes for human verification.
* **On User Interaction:** The FastAPI routers handle public queries, profile updates, and admin review approvals in real time.

---

## 2. Step-by-Step Installation & Setup

### Step 1: Open Terminal & Navigate to `backend`
Open **PowerShell** or **Command Prompt** and navigate to your backend folder:
```powershell
cd d:\PythonProjects\Shetkari-Suchna-Setu\backend
```

### Step 2: Create and Activate the Virtual Environment (`venv`)
A virtual environment isolates project dependencies from your global system.

**On Windows (PowerShell):**
```powershell
# 1. Create the virtual environment named 'venv'
python -m venv venv

# 2. If PowerShell script execution is restricted, allow it for this process:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 3. Activate the virtual environment
.\venv\Scripts\Activate.ps1
```

*(You will see `(venv)` appear at the beginning of your terminal prompt).*

**On Windows (Command Prompt `cmd`):**
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

---

### Step 3: Install Required Dependencies
Install all required libraries using the pinned `requirements.txt`:
```powershell
pip install -r requirements.txt
```

*(This installs FastAPI, Uvicorn, SQLAlchemy, Pydantic v2, HTTPX, BeautifulSoup4, PyJWT, Passlib, and Async SQLite/Postgres drivers).*

---

### Step 4: Configure the Database (`.env`)

The `.env` file is already created inside `backend/.env`.

#### Option A: Quick Local Development (Default: SQLite)
No installation or external setup required! The backend uses asynchronous SQLite (`aiosqlite`):
```ini
DATABASE_URL=sqlite+aiosqlite:///./shetkari.db
```
The database file `shetkari.db` will be created automatically on first run.

#### Option B: Production PostgreSQL / Supabase
To connect to a managed PostgreSQL database (such as **Supabase**):
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **Project Settings** $\rightarrow$ **Database** $\rightarrow$ **Connection String** $\rightarrow$ select **URI**.
3. Copy the URI and replace the prefix `postgresql://` with `postgresql+asyncpg://`:
```ini
DATABASE_URL=postgresql+asyncpg://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

---

### Step 5: Start the Backend Server
Run the local startup script:
```powershell
python start.py
```
Or run directly with Uvicorn:
```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

You should see:
```text
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

---

## 3. Verifying the API & Database

Open your web browser and visit:
1. **Health Check:** [http://localhost:8000/health](http://localhost:8000/health)
   - Response: `{"status": "healthy", "app": "Shetkari Suchna-Setu Backend", "database": "ok"}`
2. **Interactive OpenAPI / Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
   - Here you can test all endpoints directly in the browser!

---

## 4. How to Connect & Apply Government Sources / APIs

Government agriculture notices in Maharashtra are published across multiple portals. Here is how to configure and monitor them:

### Pre-Seeded Authoritative Sources
When the backend starts up for the first time, it automatically registers 3 official sources in the `sources` table:

1. **Maharashtra Krishi Vibhag (`https://krishi.maharashtra.gov.in`)**:
   - Publishes official Government Resolutions (GRs), Kharif/Rabi advisories, and state subsidies.
2. **MahaDBT Farmer Schemes (`https://mahadbt.maharashtra.gov.in`)**:
   - Central & state agricultural subsidy application portals (drip irrigation, farm mechanization, tractor subsidies).
3. **PMFBY Crop Insurance (`https://pmfby.gov.in`)**:
   - Kharif and Rabi crop insurance enrolment circulars and claim submission guidelines.

### How to Trigger a Crawl & Change Detection
To trigger a crawl on any source:
1. Open [http://localhost:8000/docs](http://localhost:8000/docs).
2. Log in as an Admin (click the **Authorize** button or call `POST /api/v1/admin/login`):
   - **Email:** `admin@shetkari-setu.gov.in`
   - **Password:** `Admin@SecurePassword123`
3. Call `POST /api/v1/admin/sources/{source_id}/poll`.
4. What happens under the hood:
   - Fetches official portal with conditional headers (`If-None-Match`, `If-Modified-Since`).
   - Normalizes HTML, strips navigation/render timestamps.
   - Computes SHA-256 content hash.
   - If changed: creates a new `NoticeVersion`, extracts fields, runs validator safety rules, and adds the notice to the **Admin Review Queue** with status `Auto-checked` or `Needs review`.

### How to Add a New Government Source
To monitor a new department page or district circular:
Send a `POST /api/v1/admin/sources` request with:
```json
{
  "name": "Mahasul Vibhag Maharashtra Circulars",
  "url": "https://mahasul.maharashtra.gov.in/notices",
  "kind": "html",
  "mode": "auto",
  "poll_minutes": 360,
  "robots_ok": true
}
```

---

## 5. The Review & Alert Lifecycle (Worked Walkthrough)

1. **Change Detected:** A new notice version is created with status `Auto-checked` (or `Needs review` if an evidence quote failed).
2. **Reviewer Inspection:**
   - Reviewer calls `GET /api/v1/admin/review-queue`.
   - The UI shows the extracted fields alongside the exact verbatim quote from the official source text.
3. **Human Approval:**
   - Reviewer calls `POST /api/v1/admin/review/{version_id}` with:
     ```json
     {
       "status": "Verified",
       "note": "Confirmed against official Gazette notification"
     }
     ```
4. **Instant Actionable Alert:**
   - The notice is marked `Verified`, locking the verified deadline into the `schemes` table.
   - The backend runs `matcher.py` against all farmer profiles in the database.
   - An in-app alert is created for every farmer whose district or crop overlaps.
   - Farmers who do not match receive zero notifications (preventing alert fatigue).

---

## 6. Running the Automated Test Suite

To verify that all components (normalization, diffing, quote validation, profile token auth, and endpoints) are operating correctly:

Run `pytest` in your terminal:
```powershell
pytest -v
```

All test suites will run against an in-memory test database, validating:
* `test_normalizer.py`: Devanagari numerals parsing and boilerplate stripping.
* `test_detector.py`: SHA-256 content hashing and unified diff generation on modified notices.
* `test_validator.py`: Catching hallucinated/fabricated quotes and conflicting deadlines.
* `test_matcher.py`: Region and crop relevance filtering.
* `test_auth_and_security.py`: Farmer token hashing, DPDP hard-deletion, and admin JWT expiry.
* `test_api_endpoints.py`: End-to-end API lifecycle.

---

## 7. Next Step: Connecting the Frontend
Once your backend is running on `http://localhost:8000`:
* Public and farmer scheme endpoints are available at: `http://localhost:8000/api/v1/schemes`
* Anonymous farmer onboarding is at: `POST http://localhost:8000/api/v1/farmer/profile`
* Crop Insurance info is at: `http://localhost:8000/api/v1/insurance`
* Admin login is at: `POST http://localhost:8000/api/v1/admin/login`
