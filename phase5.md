# phase5.md — Admin Dashboard + Alerts

**Goal:** team can operate system; alert appear for right farmers.

## Tasks
- [ ] Admin auth: email+password+MFA, RBAC (viewer/reviewer/admin), JWT short-lived.
- [ ] Sources table + health + last-checked.
- [ ] New/changed notice queue, priority sort.
- [ ] Diff view + evidence side-by-side. Approve/edit/reject/supersede.
- [ ] Audit log (append-only).
- [ ] Alert generator: idempotent per (profile, notice_version). Kinds NEW/CHANGED/DEADLINE_VERIFIED/WITHDRAWN.
- [ ] Alert preview before first publish. Per-profile rate limit.
- [ ] In-app inbox + unread badge in farmer UI.
- [ ] Metrics panel: healthy sources, queue length, detection→publish time.

## Deliverables
Reviewer can take a change from detection to published alert in the UI.

## Exit criteria
- Auth tests pass (authentication.md checklist).
- Seeded change → detected → reviewed → alert in matching farmer inbox; non-matching farmer gets none.
- Duplicate publish → no duplicate alert.
- Audit log record every review action.

## Risks
Admin UI creep. Keep ugly-but-working. Reviewer capacity.
