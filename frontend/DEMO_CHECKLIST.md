# Demo Checklist — Seva Innovation 2026

A clear, honest demo is stronger than a flashy one. Show the complete workflow on a small amount of **real** data and be explicit about what is automated, manual or simulated.

---

## 1. Demo story (3–5 minutes)

**Problem (30 s):** Farmers can miss scheme and crop-insurance updates because notices are scattered, hard to understand and change over time.

**Walkthrough (3 min):**
1. **Admin Dashboard** — a notice was detected from an official source (or imported, labelled as such). Show the detected-at time.
2. **Notice Review** — extracted fields next to the original notice; one uncertain field is flagged.
3. **Verify and publish** — reviewer confirms; status becomes *Verified*.
4. **Farmer Preferences** — a sample farmer selects district and crop and gives consent.
5. **Farmer Dashboard** — the alert appears with a *"Why you are seeing this"* reason.
6. **Notice Details** — source, publication date, last-checked time, verified deadline, conditions to check, document checklist.
7. **Change history** — show a notice whose deadline changed: old → new.
8. **Open the official portal** — the farmer continues on the government service.
9. **Impact dashboard** — detection delay, accuracy, false-alert rate with sample sizes.

**Close (30 s):** We do not replace government portals or decide eligibility. We detect changes, verify them, tell the right farmer and send them to the official service.

---

## 2. Data preparation

- [ ] At least **5–10 genuine published notices** loaded (from the backend or manual import)
- [ ] At least one notice with a **changed** deadline (two versions) to show change history
- [ ] At least one notice with an **ambiguous / missing deadline** showing "Deadline not verified"
- [ ] At least one notice in **Pending review** and one **Conflicting**
- [ ] A **failed source check** visible in Source Health with last successful retrieval
- [ ] 2–3 **synthetic farmer profiles** with different districts and crops
- [ ] Official URLs tested and working
- [ ] Every manual import labelled "Manual import"
- [ ] Any simulated item clearly labelled as demo data

Do not present manually entered or simulated updates as live automated detections.

---

## 3. What to show on screen

- [ ] Source URL, publication date and last-checked time on every notice
- [ ] Verified vs unverified distinction
- [ ] The match reason on alerts
- [ ] Marathi / English switch
- [ ] Mobile view (use a real phone or DevTools at 360 px)
- [ ] The disclaimer ("preliminary guidance, not an official eligibility decision")
- [ ] Offline banner (if implemented)

---

## 4. Statements to avoid

| Avoid | Say instead |
|---|---|
| "Real-time monitoring" | "Scheduled checks every X hours; last checked at …" |
| "100% accurate" | "Accuracy was X% on N tested notices" |
| "Farmers will get benefits" | "Helps farmers discover relevant opportunities sooner" |
| "No one else does this" | "We focus on change detection, verification trail and relevant alerts; we compared against existing platforms" *(only if the comparison is done)* |
| "AI decides eligibility" | "Rules identify potentially relevant notices; the official authority decides eligibility" |

---

## 5. Likely questions and honest answers

| Question | Suggested answer |
|---|---|
| How is this different from MahaDBT / PMFBY / myScheme? | We do not replace them. We add a monitoring and verification layer: detect new or changed notices, keep a verification trail, and alert relevant farmers, then link to those official services. *(Back this with your competitor comparison.)* |
| How do you know the information is correct? | Extracted fields are validated and checked against the original notice; uncertain or conflicting items go to human review and are not sent as verified alerts. |
| What happens if the source is down? | The dashboard shows the failed check and last successful retrieval; we never imply the data is current. |
| Do you decide eligibility? | No. Matching is preliminary guidance. |
| What personal data do you collect? | District, crops, interests, language and an optional contact channel, with consent. No Aadhaar, bank or identity documents. |
| Does it work offline / on slow networks? | *(Answer based on what is actually built.)* |
| Is it real time? | Sources are checked on a schedule; we state the frequency and last-checked time. |
| How will you measure success? | Detection delay, extraction accuracy, false-alert rate, source traceability, relevance, discovery time and actionability, evaluated through testing and a pilot. |
| Does it submit applications? | No. Farmers complete the process on the official portal. |

---

## 6. Technical readiness

- [ ] Frontend deployed and reachable (or a stable local build)
- [ ] Backend running and connected (or MSW mocks prepared and labelled)
- [ ] Admin login credentials ready (not shown on screen)
- [ ] Stable internet or a hotspot backup
- [ ] Browser zoom and window size checked for projection
- [ ] Phone ready to show the mobile view
- [ ] **Backup:** screen recording of the full flow
- [ ] **Backup:** screenshots of each key screen
- [ ] Notifications and pop-ups silenced on the demo machine

## 7. Fallback plan

| If … | Then … |
|---|---|
| Backend is down | Switch to MSW mocks with `DemoDataBanner` visible and say so |
| Internet fails | Play the recorded demo and explain |
| A source cannot be reached | Use it to demonstrate the source-failure state |
| An official link fails | Show the saved source info and state the last-checked time |

---

## 8. Final run-through

- [ ] Rehearse the full flow twice with a timer
- [ ] Agree with the backend teammate who presents which part
- [ ] Check every number shown against real data
- [ ] Re-read [CONTENT_AND_SAFETY_RULES.md](CONTENT_AND_SAFETY_RULES.md) against the live screens
