# Frontend Architecture

## Layers

```
Pages  →  Hooks  →  Services  →  Backend API
  ↓         ↓
Components  Types
```

| Layer | Responsibility | Rule |
|---|---|---|
| **Pages** (`pages/`) | One per route; compose components | No `fetch()` calls here |
| **Components** (`components/`) | Reusable UI pieces | Receive data via props; no API calls |
| **Hooks** (`hooks/`) | Wrap TanStack Query for each resource | One hook per resource (`useNotices`, `useNotice`, ...) |
| **Services** (`services/`) | All `fetch()` calls and response mapping | The only place that knows endpoint URLs |
| **Types** (`types/`) | Shared TypeScript types | Mirror the API contract |
| **i18n** (`i18n/`) | Translation setup and language files | No hard-coded user-facing strings in components |

## Folder structure

```
shetkari-suchnasetu/
├── public/
│   └── icons/                    # PWA icons (later)
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx       # admin
│   │   │   ├── Footer.tsx
│   │   │   └── AppShell.tsx
│   │   ├── notice/
│   │   │   ├── NoticeCard.tsx
│   │   │   ├── NoticeList.tsx
│   │   │   ├── NoticeHeader.tsx
│   │   │   ├── DeadlineDisplay.tsx
│   │   │   ├── SourceInfo.tsx
│   │   │   ├── DocumentChecklist.tsx
│   │   │   ├── EligibilityChecklist.tsx
│   │   │   ├── ChangeHistory.tsx
│   │   │   └── VerificationTimeline.tsx
│   │   ├── alert/
│   │   │   ├── AlertCard.tsx
│   │   │   └── MatchReason.tsx
│   │   ├── admin/
│   │   │   ├── SourceTable.tsx
│   │   │   ├── ReviewQueue.tsx
│   │   │   ├── ExtractedFieldsEditor.tsx
│   │   │   └── MetricCard.tsx
│   │   ├── ui/
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── OfflineBanner.tsx
│   │   │   ├── DemoDataBanner.tsx
│   │   │   ├── Disclaimer.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   └── charts/
│   │       ├── FreshnessChart.tsx
│   │       └── AlertsChart.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── FarmerDashboard.tsx
│   │   ├── FarmerPreferences.tsx
│   │   ├── SchemeNotices.tsx
│   │   ├── NoticeDetails.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── NoticeReview.tsx
│   │       ├── SourceHealth.tsx
│   │       └── ImpactDashboard.tsx
│   ├── hooks/
│   │   ├── useNotices.ts
│   │   ├── useNotice.ts
│   │   ├── useNoticeHistory.ts
│   │   ├── useFarmerAlerts.ts
│   │   ├── useFarmerProfile.ts
│   │   ├── useAdminSources.ts
│   │   ├── useAdminMetrics.ts
│   │   └── useOnlineStatus.ts
│   ├── services/
│   │   ├── http.ts               # shared fetch wrapper
│   │   ├── notices.ts
│   │   ├── farmers.ts
│   │   ├── admin.ts
│   │   └── mappers.ts            # API → frontend type mapping
│   ├── types/
│   │   ├── notice.ts
│   │   ├── farmer.ts
│   │   ├── alert.ts
│   │   ├── source.ts
│   │   └── metrics.ts
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── mr.json
│   ├── utils/
│   │   ├── date.ts               # locale-aware formatting
│   │   ├── status.ts             # status → label/colour/icon
│   │   └── constants.ts          # districts, crops
│   ├── mocks/                    # MSW handlers + sample JSON
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── vite.config.ts
└── package.json
```

You do not need to create every file on day one. Create files as each screen is built.

## Routing

| Route | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/farmer/dashboard` | FarmerDashboard | Farmer |
| `/farmer/preferences` | FarmerPreferences | Farmer |
| `/notices` | SchemeNotices (search and filter) | Public |
| `/notices/:id` | NoticeDetails (with history tab) | Public |
| `/login` | Login | Public |
| `/admin` | AdminDashboard | Admin only |
| `/admin/notices/:id/review` | NoticeReview | Admin only |
| `/admin/sources` | SourceHealth | Admin only |
| `/admin/impact` | ImpactDashboard | Admin only |
| `*` | NotFound | Public |

Admin routes are wrapped in a `RequireAdmin` guard that redirects to `/login`. The guard is a convenience only; **the backend must enforce admin authentication** on every admin endpoint.

## State management

| State | Where it lives |
|---|---|
| Server data (notices, alerts, sources, metrics) | TanStack Query |
| Form values | Local component state (`useState`) |
| Selected language | i18next (persisted in `localStorage`) |
| Farmer ID / session | Context provider (`AuthContext`) |
| Online/offline status | `useOnlineStatus` hook |

No global store is needed.

## Data flow example — Farmer Dashboard

```
FarmerDashboard (page)
  └─ useFarmerAlerts(farmerId)          hook (TanStack Query)
       └─ getFarmerAlerts(farmerId)     service (fetch)
            └─ GET /api/farmers/{id}/alerts
  └─ <AlertCard /> × N                  components render alert + notice summary
       └─ <StatusBadge />, <DeadlineDisplay />, <SourceInfo />
```

## Standard UI states

Every data-driven screen must handle all of these:

| State | Behaviour |
|---|---|
| Loading | Skeleton or spinner (`LoadingState`) |
| Empty | Friendly explanation and a next action (`EmptyState`) |
| Error | Plain-language message and a retry button (`ErrorMessage`) |
| Offline | Banner; show cached data labelled with its last-checked time |
| Stale | Show "last checked" prominently; never imply the data is current |

## Error handling

- `http.ts` wraps `fetch()` and throws a typed `ApiError` (`status`, `message`).
- `401` on admin routes → clear session and redirect to `/login`.
- `404` → "Notice not found" state.
- Network failure → offline state, not a generic crash.
- Never display raw server error text or stack traces to farmers.

## Security notes

- Do not store passwords or sensitive personal data in `localStorage`.
- Store only what is needed (farmer ID or token, language, cached public notices).
- Do not collect Aadhaar numbers, bank information or identity documents.
- Render notice text as plain text; do not use `dangerouslySetInnerHTML` with backend content.
- Open official links with `target="_blank"` and `rel="noopener noreferrer"`.
