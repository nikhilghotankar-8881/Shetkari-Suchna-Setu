# Deployment Guide

The frontend is a static single-page app (SPA). `npm run build` produces a `dist/` folder that any static host can serve.

---

## Environment variables

| Variable | Dev | Production |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | The deployed backend URL, for example `https://api.your-domain.example` |

Rules:
- Vite embeds `VITE_*` variables into the built JavaScript at **build time**. Changing them requires a rebuild.
- **Never** place secrets, tokens or private keys in `VITE_*` variables.
- Commit `.env.example`; keep `.env` out of Git.

---

## Build and preview

```bash
npm run build      # type-check and build into dist/
npm run preview    # serve the production build locally
```

Check:
- [ ] Build completes with no TypeScript errors
- [ ] `preview` works with the real or mock API
- [ ] Bundle sizes are reasonable (code-split admin and charts)

---

## Hosting options

Any static host works. Pick the one your team can set up fastest.

| Host | Notes |
|---|---|
| Vercel | Simple Git-based deploys; set `VITE_API_BASE_URL` in project settings |
| Netlify | Add a `_redirects` file for SPA routing |
| Cloudflare Pages | Good performance for static sites |
| GitHub Pages | Needs a `base` setting in Vite and a 404 redirect workaround for client-side routing |
| Same server as the backend | Serve `dist/` as static files if your teammate prefers a single deployment |

Check each host's current documentation for exact steps.

### SPA routing fallback

Because React Router handles routes in the browser, the host must serve `index.html` for unknown paths such as `/notices/123`.

Netlify: `public/_redirects`
```
/*    /index.html   200
```

Vercel: `vercel.json`
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## Connecting to the backend

Coordinate with your teammate:

- [ ] Backend is deployed and reachable over **HTTPS**
- [ ] **CORS** allows the deployed frontend origin (and `http://localhost:5173` for development)
- [ ] If using cookies, CORS allows credentials and cookies are `Secure` / `SameSite` configured correctly
- [ ] The frontend uses the deployed backend URL in its production build
- [ ] Admin endpoints are protected on the backend
- [ ] The backend is not using wildcard CORS together with credentials

A mixed-content error means an HTTPS frontend is calling an HTTP backend; fix by serving the backend over HTTPS.

---

## Pre-deployment checklist

- [ ] No `console.log` of personal data
- [ ] No secrets or credentials in the code or build output
- [ ] Demo / mock data is off (MSW disabled in production)
- [ ] `DemoDataBanner` appears only when demo data is in use
- [ ] Marathi and English both tested
- [ ] Official links tested and working
- [ ] 404 page and SPA fallback work
- [ ] Page title, meta description and favicon set
- [ ] PWA manifest and icons present (if the offline phase is done)
- [ ] Lighthouse mobile check run

## Post-deployment smoke test

- [ ] Home loads on a real phone over mobile data
- [ ] Notices list loads from the deployed backend
- [ ] A notice details page opens directly via URL
- [ ] Farmer preferences can be saved
- [ ] Admin login and review flow work
- [ ] Offline banner appears in airplane mode (if implemented)

## Rollback

Keep the previous deployment available (most hosts keep deployment history). If a release breaks something, redeploy the previous build, then fix forward.

## Security headers (if your host allows)

- `Content-Security-Policy` restricting scripts to your own origin
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- HTTPS only
