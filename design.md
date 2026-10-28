# design.md — UX + UI

## Principles
- Farmer first: low literacy, low-end phone, slow network. Big text, few taps.
- Marathi + English toggle. Marathi default. (Confirm in prep Q2.)
- Never imply certainty we lack. Status badge on every card.
- Official source always one tap away.

## Farmer Dashboard (4 screens + profile)
### 0. Profile (onboarding, 3 steps max)
- District → taluka → crops (multi-select, icons + names).
- Collect ONLY: district, taluka, crops, language. Nothing else. (See privacy.md.)
- Plain-language notice shown before save: what stored, why, how delete.
- Edit/delete profile always reachable.

### 1. Relevant Schemes
Card fields (all required unless noted):
- Scheme name
- Department
- Who may qualify
- Benefits (as described in official notice)
- Deadline — **only if verified**, else "Not yet verified"
- Documents/conditions in notice
- Official application link
- Source link + last-verified date
- Verification badge

### 2. Latest Updates
- Feed of new/changed notices, newest first.
- Item types: `NEW`, `CHANGED`, `DEADLINE_VERIFIED`.
- Show what changed (old → new) when change type = CHANGED.
- Illustrative example (label as such in any mock): "New Notice Detected — Agricultural Assistance Scheme. Region: selected district. Deadline: Not yet verified. Source: view original."

### 3. Crop Insurance
- Enrolment requirements, published deadlines, crop-loss reporting steps.
- Link to official portal. We do not file claims.

### 4. Alerts
- In-app inbox + unread badge. MVP only.
- Web Push, SMS, WhatsApp = later.

## Verification badges
| Badge | Meaning | Shown to farmer? |
|-------|---------|-----------------|
| Verified | Human-approved against source | Yes, full detail |
| Auto-checked | Rules pass, not human-reviewed | Yes, with "pending review" note; **no deadline** |
| Needs review | Conflict / low confidence | Hidden from farmer; admin only |
| Superseded | Newer notice replaced it | Yes, greyed, link to newer |

Rule: deadline render ⇔ Verified.

## Admin Dashboard
- Sources table: name, URL, type (auto/manual), last-checked, last-change, health.
- New notices queue. Changed notices diff view (old vs new, highlighted).
- Extracted fields next to source text snippet (evidence span).
- Review actions: approve / edit / reject / mark superseded.
- Manual-review queue. Alert preview before publish.
- Audit log view.

## UI constraints
- 360px width baseline. Test on low-end Android Chrome.
- Page weight small. No heavy libs. Lazy-load admin.
- Contrast AA. Touch target ≥ 44px.
- PWA manifest (installable). Offline = cache last-seen cards only; claim nothing more until tested.
