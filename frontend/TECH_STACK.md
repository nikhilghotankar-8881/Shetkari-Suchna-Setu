# Frontend Tech Stack

## Summary

**React + TypeScript + Vite + Tailwind CSS**, with React Router for navigation, TanStack Query for server data, i18next for Marathi/English, Recharts for dashboards and `fetch()` for API calls to the backend.

## Core stack

| Purpose | Technology | Why |
|---|---|---|
| UI framework | React + TypeScript | Reusable components; types catch API-shape mistakes early |
| Dev server and build | Vite | Fast dev server and small production build |
| Styling | Tailwind CSS | Quick responsive layouts, status badges, cards, forms |
| Routing | React Router (`react-router-dom`) | Farmer pages, notice pages, admin pages |
| Server data | TanStack Query (`@tanstack/react-query`) | Caching, refetching, loading and error states |
| Icons | Lucide React | Consistent icons for alerts, documents, status |
| Languages | i18next + react-i18next | Marathi / English (Hindi optional) |
| Charts | Recharts | Notice freshness, alert counts, metrics |
| HTTP | Native `fetch()` | No extra dependency needed |

## Supporting / dev tools

| Purpose | Technology |
|---|---|
| Unit and component tests | Vitest + React Testing Library |
| API mocking in tests and while backend is unavailable | MSW (Mock Service Worker) |
| Lint | ESLint |
| Formatting | Prettier |
| Offline / PWA (later phase) | `vite-plugin-pwa` |
| Marathi font | `@fontsource/noto-sans-devanagari` (self-hosted) |

## Install

```bash
npm create vite@latest shetkari-suchnasetu -- --template react-ts
cd shetkari-suchnasetu
npm install

# runtime
npm install react-router-dom @tanstack/react-query lucide-react
npm install i18next react-i18next
npm install recharts
npm install tailwindcss @tailwindcss/vite
npm install @fontsource/noto-sans-devanagari @fontsource/noto-sans

# dev
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom msw
npm install -D prettier eslint-config-prettier

# later (offline phase)
npm install -D vite-plugin-pwa
```

Check the current official guides for Vite, Tailwind CSS and Vite plugin versions if anything fails to install.

## Setup snippets

### `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### `src/index.css`

```css
@import "tailwindcss";
```

### `.env.example` (commit this)

```bash
VITE_API_BASE_URL=http://localhost:8000
```

### `.env` (do not commit)

```bash
VITE_API_BASE_URL=http://localhost:8000
```

Add `.env` to `.gitignore`.

### TanStack Query provider (`src/main.tsx`)

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./i18n";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
```

## TypeScript settings

Keep `"strict": true` in `tsconfig.json`. Avoid `any`; define API types in `src/types/`.

## What not to add

| Avoid | Reason |
|---|---|
| Redux or other global state libraries | TanStack Query plus a few `useState`/context values is enough |
| Heavy UI kits (MUI, Ant Design) | Larger bundles on slow networks; Tailwind is sufficient |
| Axios | Native `fetch()` is enough for this project |
| Blockchain libraries | Out of scope |
| Any secret keys in frontend code | Visible to every user |
| Google-hosted fonts via CDN | Self-host fonts so the app works on poor networks |

## Browser and device targets

- Android Chrome (mid-range and low-end phones) is the priority.
- Also support current Chrome, Edge, Firefox and Safari on desktop for the admin dashboard.
- Design for a 360 px wide screen first.
