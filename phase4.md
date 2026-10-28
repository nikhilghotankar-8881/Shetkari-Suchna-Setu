# phase4.md — Farmer Dashboard + Matching

**Goal:** farmer on phone see relevant, trustworthy cards.

## Tasks
- [ ] Profile onboarding: district → taluka → crops → language (3 steps).
- [ ] Anonymous profile + token flow (authentication.md). Hash stored.
- [ ] Privacy notice screen (mr+en) before save. Delete-my-data button.
- [ ] Matcher: region + crop overlap → "potentially relevant".
- [ ] Scheme cards (all fields, badge, source, last-verified).
- [ ] Latest Updates feed (NEW / CHANGED, show old→new).
- [ ] Crop Insurance screen (enrolment, deadlines, loss-reporting steps, official link).
- [ ] Mobile QA at 360px, low-end Android Chrome, throttled network.
- [ ] PWA manifest; cache last-seen cards only.

## Deliverables
Farmer flow end to end on public URL.

## Exit criteria
- New user → profile → relevant cards in < 1 min, no help.
- Unverified deadline renders "Not yet verified".
- Token A cannot read profile B (test).
- Delete flow removes profile + alerts.
- Every card has working official link.

## Risks
Too many fields → farmer drop-off. Marathi text overflow. Slow load on 3G.
