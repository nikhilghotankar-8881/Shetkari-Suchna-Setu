# phase6.md — Security, Hardening, Demo, Submit

**Goal:** safe, honest, demo-proof.

## Tasks
- [ ] Run encryption.md checklist. Run privacy.md checklist. Run authentication.md checklist.
- [ ] Security headers, CORS allow-list, rate limits verified.
- [ ] Observatory/SSL Labs scan. Fix findings.
- [ ] Backup + restore test once.
- [ ] Dependency audit. Secret scan on full git history.
- [ ] Load sanity (a few hundred requests; no crash).
- [ ] Fresh-device test on real phone + real network.
- [ ] Demo script: (1) farmer profile → cards; (2) edit seeded notice; (3) detect; (4) admin review; (5) farmer alert; (6) open official source.
- [ ] Backup demo: recorded video + pre-seeded data if network/source dies.
- [ ] Limits slide: poll latency, manual sources, no claim filing, "potentially relevant" ≠ eligible, DPDP posture.
- [ ] README: setup, architecture, sources list, known limits.
- [ ] Freeze features at D-2. Bugfix only.

## Exit criteria
Definition of done in plan.md all ticked. Two full dry-runs of demo without fix mid-run.

## Risks
Live source change during demo (nothing to detect) → seeded copy. Wi-Fi fail → hotspot + video.
