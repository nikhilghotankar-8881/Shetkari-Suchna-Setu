# Design System

## Design principles

1. **Clarity over decoration.** Farmers may have low digital literacy; the main fact on every screen must be obvious.
2. **Trust is visible.** Source, dates and verification status are always on screen, never hidden in a menu.
3. **Honest uncertainty.** Unverified information looks different from verified information.
4. **Mobile first.** Design at 360 px, then scale up.
5. **Low bandwidth.** Small bundles, self-hosted fonts, few images.
6. **Accessible.** Readable text, strong contrast, large tap targets, keyboard support.

> The visual mockup shared earlier (farmer dashboard, scheme details, preferences, mobile view, admin dashboard) is the visual reference. Its sample notices and dates are placeholders and must be replaced with verified, current government information before any live presentation.

---

## Colour tokens

Define as CSS variables or Tailwind theme extensions. Exact hex values can follow the mockup; the *roles* below are what matters.

| Role | Suggested tone | Use |
|---|---|---|
| Primary | Deep green | Buttons, links, active navigation (agriculture feel) |
| Primary light | Light green | Backgrounds, highlights |
| Accent | Warm amber / saffron | Highlights, "closing soon" |
| Surface | White | Cards |
| Background | Very light neutral | Page background |
| Text | Near-black | Body text |
| Muted text | Mid grey | Secondary text |
| Border | Light grey | Dividers, card outlines |

### Status colours

Always pair colour with an icon **and** a text label.

| Status | Colour | Icon (Lucide) | Label (EN) |
|---|---|---|---|
| `verified` | Green | `BadgeCheck` | Verified |
| `pending_review` | Amber | `Clock` | Pending review |
| `conflicting` | Red | `AlertTriangle` | Conflicting information |
| `expired` | Grey | `CalendarX` | Expired |
| `superseded` | Blue-grey | `Replace` | Superseded |

Other semantic colours: success (green), warning (amber), error (red), info (blue).

---

## Typography

| Use | Font |
|---|---|
| English | Noto Sans (or system sans-serif) |
| Marathi / Hindi | Noto Sans Devanagari |

- Self-host with `@fontsource` packages; do not load from a CDN.
- Body text minimum **16 px**; never below 14 px.
- Line height 1.5 or more for Devanagari to avoid clipped matras.
- Headings: clear size steps (for example 24 / 20 / 18 px on mobile).
- Test every screen in Marathi; Devanagari strings are usually longer than English, so avoid fixed widths on buttons and labels.

---

## Spacing and layout

- Base spacing unit: 4 px (Tailwind default scale).
- Card padding: 16 px on mobile, 20–24 px on desktop.
- Page horizontal padding: 16 px on mobile.
- Max content width: about 1152 px on desktop.
- Farmer pages: single column on mobile, two columns for dashboard on desktop (list + filters).
- Admin pages: sidebar + content on desktop; collapsible sidebar on tablet.

### Breakpoints (Tailwind defaults)

| Name | Min width | Use |
|---|---|---|
| (base) | 0 | Phone, designed first |
| `sm` | 640 px | Large phones |
| `md` | 768 px | Tablet |
| `lg` | 1024 px | Desktop / admin layout |

---

## Interaction

- Minimum tap target: **44 × 44 px**.
- Primary action on a screen: one clearly dominant button.
- Buttons use verbs: "Open official notice", "Save preferences", "Verify and publish".
- Show loading feedback for any action longer than about 300 ms.
- Destructive or publishing actions need a confirmation dialog.
- Visible focus ring on all interactive elements.

---

## Accessibility checklist

- [ ] Contrast ratio at least 4.5:1 for body text (WCAG AA)
- [ ] Information is never conveyed by colour alone
- [ ] All images and icons have text alternatives or are marked decorative
- [ ] Form fields have visible labels and error text linked with `aria-describedby`
- [ ] Logical heading order (`h1` → `h2` → `h3`)
- [ ] Fully usable with keyboard only
- [ ] `lang` attribute on `<html>` updates with the selected language
- [ ] Charts have a text summary or data table alternative
- [ ] Respect `prefers-reduced-motion`

---

## Key UI patterns

### Notice card
```
[Category chip]                    [Status badge]
Scheme name
Deadline: 31 Oct 2026 ✔ Verified   (or: Deadline not verified)
Why you see this: District Nashik · Crop Soybean
Last checked: 28 Oct 2026, 9:30 AM
[ View details ]
```

### Unverified warning (inline)
Amber background, `AlertTriangle` icon, text: "This information is not fully verified. Please check the official notice."

### Source box
Bordered box, source name, official URL, publication date, last-checked time, **Open official notice** button.

### Offline banner
Sticky at the top, amber, always visible while offline.

---

## Imagery

- Prefer simple icons over photos to keep pages light.
- Do not use government logos or emblems in a way that suggests the app is an official government service.
- Compress and lazy-load any images.
