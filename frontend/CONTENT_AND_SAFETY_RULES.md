# Content and Safety Rules for the UI

These rules come from the project's *Responsible Implementation* section. They apply to **every screen, string, tooltip, toast and alert** the frontend produces. If a design or a piece of copy conflicts with this file, this file wins.

---

## The non-negotiables

| # | Rule | What it means in the UI |
|---|---|---|
| 1 | **Matching is preliminary guidance** | Never say "You are eligible", "You qualify", "You will receive". Say "This may be relevant to you" and "Conditions to check". |
| 2 | **Unverified means unverified** | A deadline or condition that is not verified is shown as "Not verified", never as a plain date. |
| 3 | **Every notice shows its source** | Official URL, publication date and last-checked timestamp are visible without extra clicks. |
| 4 | **A click is not an application** | Opening an official link is not shown or recorded as "applied" or "completed". |
| 5 | **Cached data is not current data** | Offline or cached views always show the last-checked time and a "check the official source" prompt. |
| 6 | **No false real-time claims** | Say "Checked every X hours" or "Last checked at …". Never say "live" or "real-time" unless the source genuinely supports it. |
| 7 | **No unsupported claims of uniqueness** | Do not write "the only platform", "first in India" or similar. |
| 8 | **Minimal personal data** | No Aadhaar, bank, identity-document or similar fields. Ask only for district, crops, interests, language and (optionally) a contact channel. |
| 9 | **Consent first** | Profile data is used only after an explicit consent checkbox. |
| 10 | **We do not apply for the farmer** | No "Apply now" button that implies submission through our app. Use "Open official application portal". |
| 11 | **Demo data is labelled** | Sample, simulated or manually imported data shows a visible label. Never present it as a live automated detection. |
| 12 | **Not an official government site** | The app must not look like or claim to be an official government portal. |

---

## Copy: say this, not that

| Instead of | Write |
|---|---|
| You are eligible for this scheme | This scheme may be relevant to you |
| You will receive ₹… | The published benefit is … (see official notice) |
| Last date: 31 Oct (unverified date) | Deadline not verified — check the official notice |
| Apply now | Open official application portal |
| Application submitted | You opened the official portal. Complete your application there. |
| Real-time alerts | Alerts when we detect an update (sources checked every X hours) |
| 100% accurate | Accuracy: 92% of 50 tested notices *(use real numbers only)* |
| Approved / Rejected | (Never shown — we do not know) |
| We guarantee … | (Never use) |

---

## Standard disclaimers

Use the `Disclaimer` component rather than retyping.

**Short (under alerts and details):**
> This is preliminary guidance, not an official eligibility decision. Please confirm details on the official notice.

**Footer:**
> Shetkari SuchnaSetu helps you find and understand published government scheme and crop-insurance notices. It is not an official government service and does not submit applications or decide eligibility. Always use the official portal to apply.

**Offline:**
> You are offline. Showing saved information. Please check the official source for current details.

**Unverified:**
> This information is not fully verified. Please check the official notice.

**Source unavailable:**
> We could not check this source recently. Last successful check: {{date}}.

Each disclaimer needs a Marathi version in `mr.json` (see [I18N.md](I18N.md)).

---

## Required fields on every notice view

- Scheme name
- Publishing department / source name
- Official source URL (clickable, opens in new tab)
- Publication date (or "Not stated")
- Last-checked timestamp
- Verification status badge
- Deadline with verification state

If any of these are missing from the API response, show "Not available" rather than hiding the field.

---

## Handling the four failure cases

| Failure | What the user sees |
|---|---|
| **Source unavailable** | "We could not check this source recently. Last successful check: …". Never imply the information is current. |
| **Ambiguous deadline** | "Deadline not verified". No date shown as fact. |
| **Scheme not relevant** | No targeted alert. The notice remains searchable on `/notices`. |
| **Click but no application** | Record or show only "Opened official portal". Never "Applied". |

---

## Personal data rules

| Collect | Do not collect |
|---|---|
| District | Aadhaar number |
| Crops | Bank account details |
| Interests | Identity documents |
| Preferred language | Land record numbers (unless explicitly decided by the team and supported by the backend) |
| Optional contact for the chosen channel | Anything not needed for matching notices |

- Explain *why* each detail is requested next to the field.
- Provide a way to edit or delete the profile if the backend supports it.
- Do not log personal data to the browser console in production.
- Store only what is needed in `localStorage`; no sensitive data.

---

## Metrics display rules

- Always show **sample size** and **evaluation period** next to a percentage.
- Do not display a metric until it has been computed from real data.
- Label evaluation or demo data.
- Do not round up or format numbers to look better than the data.
- Describe outcomes as "intended" until a pilot confirms them.

---

## Review checklist for every pull request

- [ ] No copy implies eligibility, approval or guaranteed benefit
- [ ] Unverified fields are visibly unverified
- [ ] Source, publication date and last-checked time are shown
- [ ] No "apply" wording that implies we submit the application
- [ ] Demo data is labelled
- [ ] No new personal-data fields without team approval
- [ ] Marathi translation exists for all new strings
