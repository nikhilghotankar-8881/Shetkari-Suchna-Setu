# 🌾 Shetkari Suchna Setu — Frontend

Mobile-first PWA for farmers in Maharashtra to discover relevant, verified government schemes, circulars, and crop insurance guidance. Includes a secure, lazy-loaded Admin Console for government reviewers.

## Tech Stack
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v6
- **Icons:** Lucide React
- **PWA:** Web App Manifest + Service Worker (`sw.js`)

## Core Features Implemented

### 1. Farmer Dashboard
- **Anonymous Onboarding:** 3-step setup (District & Taluka, Multi-crop selection with icons, Marathi/English toggle). Zero PII collected (no name, phone, Aadhaar, or 7/12).
- **Privacy Notice & Consent:** DPDP Act 2023 compliant explicit consent screen with 1-click "Delete My Data" hard delete.
- **Scheme Cards:**
  - Strict Rule: **Deadline displayed only if Verified**. Auto-checked notices display *"Not yet verified"*.
  - Department provenance, benefits, eligibility, and direct link to official portals.
  - Source provenance: "View original GR" link and last-verified timestamp on every card.
- **Latest Updates Feed:** New / Changed notices with visual diff (old vs new criteria highlighted).
- **PMFBY Crop Insurance:** 72-hour loss reporting instructions, toll-free helpline, and direct link to official portal.
- **In-App Alerts Inbox:** Alerts with unread indicators and badge count in navigation bar.

### 2. Admin Console (`/admin`)
- **Lazy-Loaded:** The admin bundle is completely code-split from the farmer bundle to keep farmer bundle light (< 80 kB gzipped).
- **Authentication:** Email, password, and TOTP MFA step with RBAC (viewer, reviewer, admin).
- **Sources Monitoring:** Health status, poll intervals, and robot status for government portals.
- **Review Queue:** Side-by-side view of raw government GR evidence snippet vs AI-extracted fields with Approve, Edit, Reject actions.
- **Audit Log:** Append-only log of all reviewer decisions and publications.
- **Metrics Panel:** Real-time visibility into source health, queue velocity, and SLA adherence.

## Development

```bash
# Install dependencies
npm install

# Start local development server (http://localhost:3000)
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```

