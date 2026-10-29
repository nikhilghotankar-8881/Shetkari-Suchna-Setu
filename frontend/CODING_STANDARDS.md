# Coding Standards

Keep the code consistent and easy for the whole team to read.

---

## TypeScript

- `"strict": true` in `tsconfig.json`.
- No `any`. If you must, add a comment explaining why. Use `unknown` and narrow.
- Define API shapes in `src/types/` and reuse them.
- Prefer `interface` for object shapes, `type` for unions.
- Use union types for fixed sets, for example `VerificationStatus`.
- Handle `null` and `undefined` explicitly for optional API fields.

## React

- Function components and hooks only.
- One component per file; filename matches the component (`NoticeCard.tsx`).
- Components receive data through props; **no `fetch()` in components or pages**. Use hooks → services.
- Keep components small. Split when a file grows beyond roughly 150–200 lines.
- Use `key` props with stable IDs, not array indexes.
- Avoid prop drilling more than two levels; use context only where it genuinely helps (auth, language).
- Do not use `dangerouslySetInnerHTML` with backend content.

## Naming

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `NoticeCard` |
| Hooks | `use` + camelCase | `useNotices` |
| Functions and variables | camelCase | `formatDate` |
| Constants | UPPER_SNAKE_CASE | `MAX_RESULTS` |
| Types / interfaces | PascalCase | `FarmerProfile` |
| Files (non-component) | camelCase | `date.ts` |
| CSS / Tailwind | Utility classes; extract to a component when repeated |
| i18n keys | dot.separated.lowercase | `notice.openOfficial` |

## Tailwind

- Mobile first: write base styles for phones, then add `md:` / `lg:` overrides.
- Reuse components (`Button`, `Card`) instead of repeating long class lists.
- Use design tokens (see [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)); avoid random hex values.
- Do not set fixed widths on text containers (Marathi strings are longer).

## Accessibility

- Every interactive element must be keyboard reachable with a visible focus.
- Buttons are `<button>`, links are `<a>`; do not make clickable `<div>`s.
- Inputs have labels.
- Icon-only buttons need `aria-label`.
- Status is never conveyed by colour alone.

## User-facing text

- All strings come from i18n (`t("key")`).
- Follow [CONTENT_AND_SAFETY_RULES.md](CONTENT_AND_SAFETY_RULES.md): no eligibility claims, no false certainty, no unverified date shown as fact.

## Data and security

- No secrets in code or `VITE_*` variables.
- No sensitive personal data in `localStorage`.
- No personal data in `console.log`.
- External links: `target="_blank" rel="noopener noreferrer"`.
- Validate form input on the client for usability, but remember the backend is the authority.

## Error and empty states

Every data-driven component handles loading, empty, error and offline states. Do not leave a blank screen.

---

## Git workflow

### Branches

| Branch | Purpose |
|---|---|
| `main` | Stable, demo-ready |
| `dev` | Integration branch (optional) |
| `feature/<name>` | New work, for example `feature/notice-details` |
| `fix/<name>` | Bug fixes |
| `docs/<name>` | Documentation changes |

### Commit messages

Use short, imperative messages with a prefix:

```
feat: add DeadlineDisplay with unverified state
fix: handle null publicationDate in NoticeCard
docs: update API_INTEGRATION with real endpoints
style: format NoticeList
refactor: move notice mapping into mappers.ts
test: add StatusBadge tests
chore: update dependencies
```

### Pull request checklist

- [ ] Builds with `npm run build`
- [ ] Lint passes
- [ ] Works at 360 px and on desktop
- [ ] Loading, empty and error states handled
- [ ] Strings added to both `en.json` and `mr.json`
- [ ] No copy that overstates eligibility or certainty
- [ ] Unverified information is visibly unverified
- [ ] No secrets or personal data logged
- [ ] Screenshots attached for UI changes
- [ ] Docs updated if the API contract or structure changed

---

## Linting and formatting

- ESLint for code quality, Prettier for formatting.
- Run before committing:

```bash
npm run lint
npx prettier --write src
```

Consider a pre-commit hook (husky + lint-staged) if the team wants it.

---

## `.gitignore` essentials

```
node_modules
dist
.env
.env.local
.DS_Store
*.log
coverage
```

---

## Working with the backend teammate

- Agree on API changes **before** coding against them; update [API_INTEGRATION.md](API_INTEGRATION.md).
- Share sample JSON for every endpoint; save it in `src/mocks/`.
- Report API problems with the request URL, the response and the expected shape.
- Keep the type definitions and the real responses in sync; when the backend changes a field, update `types/` and `mappers.ts` in the same commit.
