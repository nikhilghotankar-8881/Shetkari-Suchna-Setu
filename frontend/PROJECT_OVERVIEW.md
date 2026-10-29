# Project Overview

## Project

**Shetkari SuchnaSetu: Verified Government Scheme and Crop Insurance Alerts for Farmers**

A focused monitoring-and-verification layer that detects new or changed government scheme and crop-insurance notices, verifies the published details, identifies potentially relevant opportunities for a farmer, and helps the farmer reach the official service with clear next steps.

## Problem

Farmers in rural areas and smaller cities may miss agricultural schemes, financial assistance and crop-insurance opportunities because:

- information is published across several official sources,
- eligibility conditions are hard to understand,
- deadlines and application requirements change,
- they may not hear about updates in time.

Existing platforms (scheme discovery portals, MahaDBT, PMFBY and others) already provide scheme listings and application services. Farmers still have to work out whether a **new or revised notice affects them** and **what to do next**.

## Solution

1. **Discover** — detect new or changed notices from selected official sources.
2. **Verify** — check dates, eligibility and requirements against the original notice; flag anything uncertain.
3. **Personalise** — identify potentially relevant notices from the farmer's district, crop and interests.
4. **Help the farmer act** — show the checklist, documents, deadline and the official application link.
5. **Measure** — track detection delay, accuracy, false alerts, relevance and actionability.

The platform does not replace official portals, does not submit applications and does not decide eligibility or approval.

## Target users

| User | Needs |
|---|---|
| **Farmer** (pilot: selected rural districts of Maharashtra) | Timely, simple, trustworthy alerts; clear deadline and next step; works on a basic phone and slow network; Marathi language |
| **Admin / reviewer** | See new and changed notices, review uncertain extractions, publish verified records, watch source health |
| **Evaluator / judge** | See the verification trail, source traceability and measurable reliability |

## Who owns what

| Area | Frontend (you) | Backend (teammate) |
|---|---|---|
| Source monitoring and change detection | Display results | Implement |
| AI extraction and validation | Display extracted fields and status | Implement |
| Human review queue | Review UI | Review API and persistence |
| Eligibility / relevance matching | Display reason for match | Rules engine |
| Alerts | Display, mark read, link out | Generate and deliver |
| Farmer profile | Form and consent UI | Store and validate |
| Authentication for admin | Login UI, route guards | Issue and verify tokens |
| Metrics | Charts and tables | Compute and expose |

## Key frontend challenges

- **Trust:** the UI must make source, publication date, last-checked time and verification status obvious on every notice.
- **Honesty:** unverified or conflicting information must be visibly different from verified information.
- **Accessibility:** farmers may have low digital literacy, small screens, slow networks and may prefer Marathi.
- **Responsibility:** copy must never overstate eligibility, certainty or real-time freshness.

## Pilot scope (first prototype)

- A limited set of official agricultural scheme and crop-insurance sources (for example MahaDBT, PMFBY and the Maharashtra Agriculture Department).
- Scheduled checks where technically and legally feasible, plus a manual import fallback.
- Detection of new or changed notices.
- Extraction and validation of key information.
- Farmer-profile-based filtering.
- A dashboard showing notices, changes and source information.
- Notification generation and links to official services.
- A small evaluation dataset of real published notices.

The UI must report how frequently each source is checked and when it was last checked. It must not promise comprehensive real-time monitoring.

## Success metrics the frontend must surface

| Metric | Where it appears |
|---|---|
| Update detection delay | Impact dashboard |
| Information accuracy | Impact dashboard |
| False-alert rate | Impact dashboard |
| Source traceability | Impact dashboard; every notice card |
| Farmer relevance | Impact dashboard |
| Information discovery time | Impact dashboard (from evaluation data) |
| Actionability | Impact dashboard (from evaluation data) |

Report the **actual sample size** next to every metric. Do not show percentages without it.

## Out of scope

- Replacing MahaDBT, PMFBY or any official portal
- Submitting applications on behalf of farmers
- Deciding eligibility, approval or entitlement
- Blockchain storage
- Collecting Aadhaar, bank or identity documents
- Claiming real-time monitoring for sources that do not support it
- Claiming uniqueness before a comparison with existing platforms is done
