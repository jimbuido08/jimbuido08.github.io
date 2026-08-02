# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Static personal portfolio site for James Imbuido (Data Scientist / AI Engineer). Single page, no build step, deployed via GitHub Pages. Visual system is "Alabaster & Ink" — a paper/ink editorial aesthetic with a light/dark theme.

## Architecture

### File roles
- `index.html` — Single-page markup. Sections in order: hero, about, skills, experience, **projects** (modeling case-study cards with Unfold), **visualizations** (external dashboard link cards), contact. Project & viz thumbnails are **inline SVG**, not asset files. Contains two inline scripts: a no-flash theme bootstrap in `<head>` (lines ~33–55) and a JS-only class marker at the end of `<body>` (line ~873).
- `style.css` — Base styles, mobile-first. Implements tokens strictly from `docs/design-tokens.md` (no raw hex/px/ms in this file; add a token first). Includes a `@media print` block that strips chrome and forces Unfold panels open.
- `mediaqueries.css` — Breakpoint overrides only: ≤1200 (compact desktop, 3-col stats), ≤900 (single-column grids, mobile nav), ≤600 (full-width buttons, single-col stats; also overrides `--section-y`), ≤380 (shrinks display type). Mobile base lives in `style.css`.
- `script.js` — Four client-side behaviors (theme toggle, reveal-on-scroll, unfold expand/collapse, skill filter). Wrapped in an IIFE; bails if `html.js` marker is absent. Style: ES5 (`var`, `function` expressions, no arrow/const/let) for broadest browser support.
- `docs/design-tokens.md` — Source of truth for color, spacing, typography, radius, motion. Update this first, then mirror into `style.css`.
- `assets/` — PDFs (CV, project info sheets) plus legacy PNGs/icons. Most PNGs are unused after the redesign — the page renders thumbnails as inline SVG. Keep the CV PDF; the project info sheets back the Unfold "Information Sheet" buttons.

### Design system constraints
- `style.css` mirrors `docs/design-tokens.md` token-for-token. Adding a new color/radius/etc. = add the token first, then reference it.
- Both light and dark themes are declared on `:root` (light) and `:root[data-theme="dark"]` (dark) using the same token names.
- Contrast is verified to WCAG AA at token-definition time — `--slate` is non-body only.

### JS-only progressive enhancement
- Inline `<script>` at the end of `<body>` adds `class="js"` to `<html>` before `script.js` loads.
- `script.js` bails out (no behaviors) if the marker is missing — so no-JS users get a fully expanded, fully visible page.
- The no-flash theme bootstrap runs synchronously in `<head>` and reads `localStorage("theme")` → `prefers-color-scheme` → light, then sets `data-theme` on `<html>` before paint.

### Interactive behaviors (`script.js`)
1. **Theme toggle** — toggles `data-theme` on `<html>`, persists to `localStorage`, syncs `aria-pressed`. If user has no stored preference, follows OS changes live.
2. **Reveal on scroll** — `IntersectionObserver` at threshold 0.15, unobserve after first reveal. Honors `prefers-reduced-motion` (becomes a no-op).
3. **Unfold** — case-study panels. Wired via `data-unfold-target`/`data-unfold-panel` pairs. Deep-linkable via `#unfold-<id>` (opens on load). `Escape` closes the open panel and returns focus to its button. Focus moves into the panel on open.
4. **Skill filter** — multi-select chips with `data-filter` and project cards with `data-skills`. Empty filter set shows all; otherwise card must match ≥1 active filter. Toggles `is-hidden` on cards; shows `#project-grid-empty` no-results region via the `hidden` attribute; toggles the `Clear` chip (`data-filter="clear"`) when any filter is active.

### Section distinction: Projects vs Visualizations
- **Projects** — internal case-study cards. Each has a `data-skills` attribute for filtering and (optionally) an Unfold panel with `data-unfold-target` linking to a `#unfold-<id>` panel.
- **Visualizations** — external dashboard link cards. No filter, no Unfold — just an outbound link to a Tableau/Power BI dashboard. Visual treatment matches Projects (`.viz-card` mirrors `.project-card`).

### Accessibility patterns in use
- Skip-link to `#main`, `aria-label` on nav, `role="list"` on `<ul>`s for explicit semantics.
- All interactive chips: `aria-pressed`. Unfold buttons: `aria-expanded` + `aria-controls`.
- All decorative SVGs use `aria-hidden="true"`; the `<figure>` wrapper may carry an `aria-label`.
- Filter grid shows a `<p hidden>` no-results region (`#project-grid-empty`) toggled via the `hidden` attribute.

### Cloudflare Web Analytics (currently dormant)
- Inline script near end of `<body>` only loads `beacon.min.js` when `token` is a 32-char hex string.
- The placeholder `PLACEHOLDER_TOKEN` is intentional — leaves analytics off without removing the hook. To activate, replace with a real token from the Cloudflare dashboard.

## Development Commands
No build, lint, or test step.

- Local preview: `python3 -m http.server` from the repo root → http://localhost:8000
- Deploy: push to `main`. GitHub Pages serves from the repo root; no build output, no `_site/`/`dist/` to publish — every file at the top level is live.
- Validate a token in the Cloudflare beacon hook by checking it matches `/^[a-f0-9]{32}$/i` (see inline script near end of `<body>`).

## Conventions
- Section comments in `index.html` use `<!-- ─── Name ─────... -->` banners.
- `script.js` is one IIFE, vanilla JS, `use strict`, no dependencies, ES5 style (`var` + `function`, no arrow/const/let). Initialize each behavior in its own `init*()` function and call from the bottom `init()` bootstrap.
- BEM-ish class naming in CSS: `.block`, `.block__element`, `.block--modifier` (e.g., `.theme-toggle__icon--sun`, `.btn--primary`).
- CSS file order: `style.css` declares the token + base layers; `mediaqueries.css` only contains breakpoint overrides; do not duplicate base rules between them.
- `--slate` is non-body only (3.47:1 on alabaster). Use it for eyebrows, captions, meta — never for paragraph body text.
