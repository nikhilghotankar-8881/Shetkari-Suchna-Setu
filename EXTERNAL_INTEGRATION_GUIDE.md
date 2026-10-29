# External Integration & Human Action Guide

This guide identifies components that **cannot be automated by an AI agent** and provides instructions for the external assets, credentials, and manual decisions you must supply.

---

## 1. External Asset Checklist (What You Need to Provide)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL DEPENDENCY CHECKLIST                   │
├────────────────────┬───────────────────────────────────────┬───────────┤
│ Requirement        │ Purpose                               │ Action    │
├────────────────────┼───────────────────────────────────────┼───────────┤
│ 1. Supabase Vault  │ Secure database storage               │ [ ] DONE  │
│ 2. Production Host │ Public URL over HTTPS                 │ [ ] PENDING│
│ 3. LLM API Key     │ Autonomous field extraction           │ [ ] OPTION│
│ 4. Official PDFs   │ Real Maharashtra circular benchmarks  │ [ ] PENDING│
│ 5. Physical Phone  │ 360px viewport & 3G network validation│ [ ] PENDING│
└────────────────────┴───────────────────────────────────────┴───────────┘
```

---

## 2. Detailed Breakdown of Human Responsibilities

### Item 1: Production Database Access & Security
* **Why AI cannot do this:** Database credentials, role management, and access control policies belong to your private account.
* **Current Status:** You connected Supabase in `backend/.env`.
* **Action Required from You:**
  1. Open your Supabase Dashboard $\rightarrow$ **Authentication** $\rightarrow$ **Policies** (Row Level Security).
  2. If deploying to production with public access, verify that RLS is enabled on tables where client-side queries might be exposed.
  3. Ensure your database password in `.env` is never committed to a public Git repository.

---

### Item 2: Cloud Deployment & Public HTTPS Domain
* **Why AI cannot do this:** Hosting accounts, credit card verifications, and DNS name registration require human identity and payments.
* **Action Required from You:**
  1. **Backend Deployment (e.g., Render, Railway, Fly.io, or AWS EC2):**
     - Push the repository to GitHub.
     - Connect the repository to your host.
     - Set the start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
     - Add environment variables (`DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS`).
  2. **Frontend Deployment (e.g., Vercel, Netlify):**
     - Build command: `npm run build`.
     - Output directory: `dist`.
     - Add environment variable: `VITE_API_BASE_URL=https://your-backend-url.onrender.com`.

---

### Item 3: Commercial LLM API Keys (Optional)
* **Why AI cannot do this:** Financial billing and API token generation are bound to your private provider accounts.
* **Action Required from You:**
  - If you want the autonomous extractor to parse circulars using commercial LLMs (OpenAI, Anthropic, or Google Gemini):
    1. Generate an API key from your developer console.
    2. Add it to `backend/.env`:
       ```ini
       OPENAI_API_KEY=sk-...
       LLM_MODEL=gpt-4o-mini
       ```
  - *Note:* The system includes a fallback regex/rule parser, so an API key is optional for baseline testing.

---

### Item 4: Real Maharashtra Government Resolutions (GRs)
* **Why AI cannot do this:** Authoritative government portals (`krishi.maharashtra.gov.in`, `mahadbt.maharashtra.gov.in`) periodically update their public notice listings and require contextual verification.
* **Action Required from You:**
  1. Collect 3 to 5 real Government Resolutions (GRs) in PDF format from [maharashtra.gov.in](https://www.maharashtra.gov.in) or [krishi.maharashtra.gov.in](https://krishi.maharashtra.gov.in).
  2. Place them in `backend/tests/fixtures/` as ground-truth test documents.
  3. Confirm whether the PDFs are digital text (machine-readable) or scanned bitmap images (which require OCR processing).

---

### Item 5: Human Reviewer Role in the Demo
* **Why AI cannot do this:** By architectural principle (*"Machine Proposes, Human Decides"*), the system prohibits automated verification of deadlines.
* **Action Required from You:**
  - In presentations or evaluative dry-runs, you (or a teammate) must play the role of the Agricultural Reviewer:
    1. Log in at `http://localhost:3000/admin/login`.
    2. Review the detected changes in the queue.
    3. Click "Approve" to transition the notice to `Verified` status and trigger farmer alerts.

---

### Item 6: Real Mobile Device QA
* **Why AI cannot do this:** Browser emulators cannot replicate real-world outdoor lighting conditions, low-cost Android hardware memory limits, or intermittent rural 3G network behavior.
* **Action Required from You:**
  1. Connect a physical Android smartphone to the same local Wi-Fi network as your development machine.
  2. Open Chrome on your phone and navigate to `http://<your-computer-ip>:3000`.
  3. Validate:
     - Touch targets are easy to tap ($\ge 44\text{px}$).
     - Marathi Devanagari typography renders clearly without text truncation.
     - The onboarding flow completes smoothly on mobile viewports.
