# privacy.md — Data Privacy

## Principle
Collect least. Keep short. Explain plain. Let farmer delete.

## Data inventory
| Data | Source | Purpose | Sensitivity | Store? |
|------|--------|---------|-------------|--------|
| District, taluka | Farmer | Match schemes | Low alone; personal when linked to a device/person | Yes |
| Crops | Farmer | Match schemes | Low | Yes |
| Language | Farmer | UI | Low | Yes |
| Profile token (hashed) | Server | Identify returning device | Medium | Hash only |
| Alert read-state | App | Inbox | Low | Yes |
| IP address | Request | Rate limit/abuse | Personal data | Short-lived, not in app DB |
| Admin email | Admin | Login | Personal | Yes (auth provider) |
| Notices/schemes | Public govt sources | Core product | Public | Yes |
| Phone number | — | SMS/WhatsApp | High | **Not in MVP** |
| Name, Aadhaar, bank, land records, GPS | — | — | High | **Never collected** |

## Rules
1. **Minimization:** only fields in table above. New field = update this file first.
2. **Purpose limit:** profile data used only to match notices + show alerts. No ads, no sale, no sharing.
3. **No third-party trackers.** No analytics SDK that fingerprint users. If analytics needed → self-host/aggregate only, no profile link.
4. **LLM boundary:** only public notice text goes to AI API. Farmer data never leaves our DB to any LLM/vendor.
5. **Logs:** no tokens, no profile contents, truncate/hash IPs, short retention (≤ 30 days).
6. **Retention:** profile auto-delete after 12 months no activity (`last_seen_at`). Alerts older than 90 days purged. Raw snapshots = public data, keep for traceability.
7. **Delete:** "Delete my data" button → hard delete profile + alerts. Confirm result to farmer.
8. **Notice (plain language, Marathi + English)** shown before profile save: what we store, why, how long, how delete, who to contact. Consent = explicit tap, not pre-ticked.
9. **Children:** app not directed at children; no age collection. Do not market to minors.
10. **Breach plan:** who detect, who decide, who inform. Written, one page, before demo day.

## Legal context (not legal advice — we are not lawyers; check with counsel/mentor)
- India DPDP Act 2023 + DPDP Rules 2025 notified Nov 2025, phased. Core duties (notice, consent, security safeguards, breach intimation, rights) start ~mid-May 2027 per published timelines; consent-manager framework ~Nov 2026. 
- Prototype likely before core duties bite, but **build as if they apply**: cheaper than retrofit, and it is a real strength at demo.
- Notice must be plain, itemised, available in local language (Marathi) — fits our design.
- Verify current dates/obligations before launch beyond hackathon.

## Counter-argument check
"District + crops not personal data, skip all this." Wrong-ish: tied to a persistent device token, small taluka population, it can single out a person. Cost to comply is low; keep.

## Pre-launch checklist
- [ ] Data inventory matches real DB schema.
- [ ] Privacy notice live, mr + en.
- [ ] Delete flow tested end to end.
- [ ] No PII in logs (grep).
- [ ] No third-party scripts in page (check network tab).
- [ ] Retention jobs written.
- [ ] Breach one-pager written.
