# Design Tokens — Alabaster & Ink

Source of truth for the visual system. `style.css` is implemented strictly from these
tokens — no value should be invented twice. If you find yourself reaching for a raw
hex / px / ms in stylesheet code, add a token here first.

Naming convention: `--{category}-{role}` for the canonical token, with light/dark
defined as separate declarations of the same name on `:root` and `:root[data-theme="dark"]`.

---

## 1. Color

### 1.1 Light (default)

| Token            | Value     | Role                                         |
| ---------------- | --------- | -------------------------------------------- |
| `--alabaster`    | `#FAFAFA` | Page background (paper).                     |
| `--surface`      | `#FFFFFF` | Card / panel background (lifted off paper).  |
| `--ink`          | `#1D1D1F` | Primary text.                                |
| `--slate`        | `#86868B` | Secondary text, captions, meta.              |
| `--rule`         | `#E5E5E7` | Hairline borders, dividers.                  |
| `--accent`       | `#0066CC` | Links, focus, primary CTA hover.             |
| `--accent-press` | `#0052A3` | Pressed/active state.                        |
| `--accent-soft`  | `#E6F0FA` | Tinted backgrounds (e.g., active filter).    |
| `--on-accent`    | `#FFFFFF` | Text on filled accent.                       |
| `--shadow`       | `0 1px 2px rgba(29,29,31,.04), 0 8px 24px rgba(29,29,31,.06)` | Card lift. |

Contrast checks (WCAG AA — verified at file write time):
- `--ink` on `--alabaster` → 16.1:1 (body, AAA)
- `--slate` on `--alabaster` → 3.47:1 — **large text / non-body only** (eyebrows,
  captions, meta). Never use for paragraph body. ≥ 3.0 satisfies AA-large.
- `--alabaster` on `--ink` → 16.1:1 (inverse, AAA)
- `--accent` on `--alabaster` → 5.33:1 (link, AA)
- `--on-accent` on `--accent` → 5.57:1 (button, AA)

### 1.2 Dark

| Token            | Value     | Role                                         |
| ---------------- | --------- | -------------------------------------------- |
| `--alabaster`    | `#0E0E10` | Page background (ink, paper inverted).        |
| `--surface`      | `#17171A` | Card / panel background.                     |
| `--ink`          | `#F5F5F7` | Primary text (alabaster-tinted).             |
| `--slate`        | `#A1A1A6` | Secondary text.                              |
| `--rule`         | `#2C2C2E` | Hairline borders.                            |
| `--accent`       | `#4D9EFF` | Lifted blue (was 6.2:1 → 7.4:1 on dark bg).  |
| `--accent-press` | `#80B6FF` | Pressed.                                     |
| `--accent-soft`  | `#0E2A4D` | Tinted backgrounds.                          |
| `--on-accent`    | `#0E0E10` | Text on filled accent.                       |
| `--shadow`       | `0 1px 2px rgba(0,0,0,.5), 0 8px 24px rgba(0,0,0,.4)` | Card lift. |

---

## 2. Spacing

8px base scale.

| Token            | Value | Common use                |
| ---------------- | ----- | ------------------------- |
| `--space-0`      | `2px` | Hairline stack gap.       |
| `--space-1`      | `8px` | Tight stack.              |
| `--space-2`      | `16px`| Default inline gap.       |
| `--space-3`      | `24px`| Card inner padding.       |
| `--space-4`      | `32px`| Section inner padding.    |
| `--space-5`      | `48px`| Major gutter.             |
| `--space-6`      | `64px`| Section vertical rhythm.  |
| `--space-7`      | `96px`| Hero/display.             |
| `--space-8`      | `128px`| Page margin cap.        |

Layout margins (page-level):
- `--page-x`: `clamp(1.25rem, 4vw, 4rem)` (responsive horizontal page padding)
- `--section-y`: `clamp(4rem, 10vh, 8rem)` (vertical section padding)

---

## 3. Typography

### 3.1 Type pair

- **Display / headings:** Playfair Display — weights 400, 600, 700
- **UI / body:** Inter — weights 300, 400, 500, 600

Loaded from Google Fonts:
```
https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;600;700&display=swap
```

### 3.2 Type scale (fluid via `clamp()`)

| Token              | Value                                       | Role          |
| ------------------ | ------------------------------------------- | ------------- |
| `--fs-display`     | `clamp(2.75rem, 5.5vw + 1rem, 5rem)`        | Hero title.   |
| `--fs-h1`          | `clamp(2rem, 3.5vw + 1rem, 3.25rem)`        | Section title.|
| `--fs-h2`          | `clamp(1.5rem, 1.5vw + 1rem, 2rem)`         | Sub-heading.  |
| `--fs-h3`          | `clamp(1.125rem, .75vw + 1rem, 1.375rem)`   | Card title.   |
| `--fs-body`        | `1.0625rem`                                 | Body.         |
| `--fs-body-sm`     | `0.9375rem`                                 | Compact body. |
| `--fs-caption`     | `0.8125rem`                                 | Caption/meta. |
| `--fs-eyebrow`     | `0.75rem`                                   | Eyebrow (uppercase, tracked). |

### 3.3 Line height & tracking

| Token              | Value     | Role                       |
| ------------------ | --------- | -------------------------- |
| `--lh-display`     | `1.05`    | Hero / display.            |
| `--lh-heading`     | `1.2`     | H1–H3.                     |
| `--lh-body`        | `1.6`     | Body copy.                 |
| `--ls-eyebrow`     | `0.18em`  | Eyebrow tracking.          |
| `--ls-tight`       | `-0.02em` | Display tracking.          |

---

## 4. Radius

| Token            | Value     | Role                |
| ---------------- | --------- | ------------------- |
| `--radius-sm`    | `6px`     | Chips, tags.        |
| `--radius-card`  | `12px`    | Cards, panels.      |
| `--radius-button`| `999px`   | Pill buttons.       |

---

## 5. Motion

| Token              | Value     | Role                              |
| ------------------ | --------- | --------------------------------- |
| `--motion-fast`    | `120ms`   | Hover, focus.                     |
| `--motion-base`    | `220ms`   | Reveal, Unfold, color shift.      |
| `--motion-slow`    | `400ms`   | Hero intro, large surface moves.  |
| `--ease-out`       | `cubic-bezier(.22,1,.36,1)` | Standard ease.        |
| `--ease-in-out`    | `cubic-bezier(.65,0,.35,1)` | Symmetric transitions.|

Reduced-motion override (in stylesheet, not as a token — applied via media query):
- All `--motion-*` durations → `0.01ms`.
- All reveal transforms → no-op.
