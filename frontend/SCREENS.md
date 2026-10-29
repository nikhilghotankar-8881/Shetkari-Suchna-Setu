# Screens Specification

Every screen below lists its purpose, route, API data, content, states and acceptance criteria. Build in this order: **Farmer Dashboard → Notice Details → Farmer Preferences → Admin Dashboard → Review Screen → Source Health → Impact Dashboard.**

All screens are **mobile-first** (design at 360 px wide) and must support Marathi and English.

---

## 1. Home (`/`)

**Purpose:** Explain the service in one glance and send the user to the right place.

**Content**
- App name and one-line promise: "Know about relevant government scheme and crop-insurance updates in time."
- Primary buttons: **Set up my alerts** (→ `/farmer/preferences`) and **Browse notices** (→ `/notices`).
- Short "How it works" strip: Official notice → Verified → Matched to you → Open official service.
- Language switcher.
- Footer with the standard disclaimer (see [CONTENT_AND_SAFETY_RULES.md](CONTENT_AND_SAFETY_RULES.md)).

**Acceptance**
- [ ] Works at 360 px width
- [ ] Both primary actions reachable without scrolling on a typical phone
- [ ] Does not claim to be an official government site

---

## 2. Farmer Dashboard (`/farmer/dashboard`)

**Purpose:** Show the newest potentially relevant, verified notices for this farmer.

**API:** `GET /api/farmers/{id}/alerts`, optionally `GET /api/notices`

**Content**
- Greeting with the farmer's selected district and crops (with an **Edit** link to preferences).
- List of `AlertCard`s sorted by deadline (soonest first) then publication date. Each card shows:
  - Scheme name and category (scheme / crop insurance)
  - `StatusBadge` (Verified / Pending / etc.)
  - Deadline (via `DeadlineDisplay`; shows "Deadline not verified" when unverified)
  - **Why you are seeing this:** match reason (for example "Matches your district: Nashik; crop: Soybean")
  - Last-checked timestamp
  - **View details** button
- Filters: category, "closing soon", read / unread.
- Offline banner when applicable.
- Standard disclaimer.

**States:** loading, empty ("No relevant notices right now. We will notify you when one is published."), error, offline.

**Acceptance**
- [ ] Every card shows source info or a link to it
- [ ] Unverified deadlines are never shown as dates
- [ ] Match reason is visible on every alert
- [ ] Empty state explains what happens next

---

## 3. Scheme Notices (`/notices`)

**Purpose:** Let anyone browse and search all published verified notices, even without alerts.

**API:** `GET /api/notices` (with query params for search/filter if the backend supports them; otherwise filter client-side)

**Content**
- Search box (scheme name).
- Filters: category, district, crop, status.
- `NoticeList` of `NoticeCard`s.
- Pagination or "Load more".

**Acceptance**
- [ ] Filters work and can be cleared
- [ ] Each card shows status, last-checked time and source link

---

## 4. Notice Details (`/notices/:id`)

**Purpose:** The most important screen. Gives the farmer everything needed to understand a notice and reach the official service.

**API:** `GET /api/notices/{id}`, `GET /api/notices/{id}/history`

**Layout (top to bottom)**
1. **Header:** scheme name, department, `StatusBadge`.
2. **Key dates:** publication date, application opening date, closing date (each with its verification state), **last checked**.
3. **Source box (`SourceInfo`):** source name, official URL, "Open official notice" button.
4. **Summary:** plain-language explanation of what the notice is.
5. **Who it may concern:** regions and crops.
6. **Eligibility conditions** (`EligibilityChecklist`): shown as "Conditions to check", not as a pass/fail.
7. **Documents required** (`DocumentChecklist`): checkboxes the farmer can tick locally (stored only on-device).
8. **Next steps:** ordered list ending with **Open official application portal**.
9. **Change history tab (`ChangeHistory`):** version list with what changed (for example "Closing date changed: 15 Oct → 31 Oct"), retrieval timestamps.
10. **Verification timeline (`VerificationTimeline`):** pending review → verified (with reviewer and time) or conflicting.
11. **Disclaimer:** preliminary guidance only.

**Special states**
- **Pending review / Conflicting:** show a prominent warning: "This information has not been fully verified. Please check the official notice."
- **Expired:** show "This notice has expired" and hide the apply button.
- **Superseded:** link to the newer notice.
- **Source failure:** show "Source could not be checked recently. Last successful check: …".

**Acceptance**
- [ ] Source URL, publication date and last-checked time always visible
- [ ] Verified and unverified fields are visually distinct
- [ ] Change history shows old and new values
- [ ] The official link opens in a new tab with `rel="noopener noreferrer"`
- [ ] Never states the farmer is eligible

---

## 5. Farmer Preferences (`/farmer/preferences`)

**Purpose:** Collect the minimum information needed for relevance matching, with consent.

**API:** `POST /api/farmers`, `POST /api/farmers/{id}/preferences` (and a GET if provided)

**Fields**
| Field | Type | Required |
|---|---|---|
| Name (or nickname) | text | Optional |
| District | select (Maharashtra districts) | Yes |
| Crops | multi-select | Yes |
| Interests | checkboxes: crop insurance, financial assistance, equipment subsidy, irrigation, other | Optional |
| Preferred language | Marathi / English (/ Hindi) | Yes |
| Notification channel | In-app (default), Email / SMS / WhatsApp only if the backend supports them | Optional |
| Contact detail | Only if a non-in-app channel is chosen | Conditional |
| **Consent checkbox** | "I agree to use these details to show me relevant notices." | Yes |

**Do not add** fields for Aadhaar, bank account, identity documents, land records or caste/category unless the team explicitly decides and the backend supports it with proper safeguards.

**Acceptance**
- [ ] Cannot submit without district, crop and consent
- [ ] Clear success message and redirect to the dashboard
- [ ] Explains why each detail is requested
- [ ] Farmer can edit or delete their profile (if the backend supports deletion)

---

## 6. Login (`/login`)

**Purpose:** Admin sign-in. (Farmers can use a simple profile ID flow if that is what the backend implements.)

**Acceptance**
- [ ] Generic error message on failure (do not reveal whether the username exists)
- [ ] Redirect back to the originally requested admin page after login
- [ ] Logout available from the admin layout

---

## 7. Admin Dashboard (`/admin`)

**Purpose:** Operational overview.

**API:** `GET /api/notices` (all statuses, admin scope), source and metrics endpoints (see [API_INTEGRATION.md](API_INTEGRATION.md))

**Content**
- Metric cards: sources monitored, new notices (24 h), changed notices, failed checks, pending verification.
- **Review queue:** table of notices with status `pending_review` or `conflicting`, with a **Review** button.
- Recent changes feed.
- Failed source checks list with last successful check time.

**Acceptance**
- [ ] Pending items are impossible to miss
- [ ] Failed checks show the last successful retrieval, not just "failed"

---

## 8. Notice Review (`/admin/notices/:id/review`)

**Purpose:** Let a reviewer compare extracted fields to the original notice and publish or reject.

**API:** `GET /api/notices/{id}`, `POST /api/admin/notices/{id}/verify`

**Layout:** two columns on desktop (stack on mobile).
- **Left:** original document / source link and, if available, extracted raw text.
- **Right:** `ExtractedFieldsEditor` — scheme name, dates, regions, crops, eligibility, documents; each field has a status (OK / uncertain / conflicting) and can be edited.
- Actions: **Verify and publish**, **Keep as unverified (withhold alerts)**, **Reject**.
- Confirmation dialog before publishing.

**Acceptance**
- [ ] Fields flagged as uncertain are highlighted
- [ ] Publishing requires explicit confirmation
- [ ] Result is shown immediately after the action

---

## 9. Source Health (`/admin/sources`)

**Purpose:** Show how reliable monitoring is.

**Table columns:** source name, URL, access method (automated / manual import), check frequency, last checked, last successful check, status.

**Acceptance**
- [ ] Manually imported notices are clearly labelled "Manual import"
- [ ] Check frequency is shown, so the UI never implies real-time monitoring

---

## 10. Impact and Reliability Dashboard (`/admin/impact`)

**Purpose:** Show evidence that the system works.

**Charts and cards (Recharts)**
- Update detection delay (average / median)
- Information accuracy (%)
- False-alert rate (%)
- Source traceability (% of alerts with working source and timestamp)
- Farmer relevance (%)
- Alerts sent over time
- Notices by status

**Rules**
- Show the **sample size** next to every percentage.
- Show the evaluation period.
- Label demo or evaluation data clearly.

**Acceptance**
- [ ] Every metric has a definition tooltip
- [ ] No metric is shown without its sample size

---

## 11. Not Found (`*`)

Friendly message and a button back to Home.

---

## Mobile layout notes

- Single column; sticky bottom navigation for farmers (Home, Alerts, Notices, Profile) if it fits the design.
- Minimum tap target 44 × 44 px.
- Primary action button full width on mobile.
- Admin dashboard may be desktop-first, but must remain usable on a tablet.
