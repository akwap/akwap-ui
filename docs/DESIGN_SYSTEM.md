# AkwapUI design system

AkwapUI is an original, token-driven design system for Vue 3 and Tailwind CSS v4. Its visual language (calm neutrals, a single brand ramp, soft elevation, 4px spacing grid, compact controls) takes inspiration from Fluent 2, but it ships no Microsoft branding, icons, fonts or other assets. Icons come from Lucide (ISC licence) and type uses each platform's system font stack.

## Principles

1. **Clear before clever.** Every screen has one obvious primary action; secondary actions are quieter.
2. **Accessible by default.** Components wire up labels, descriptions, focus and ARIA so the accessible path is the easy path.
3. **Tokens, not values.** Components never use raw colours or pixel values. Change a token and everything follows.
4. **Calm motion.** Short, purposeful transitions that respect `prefers-reduced-motion`.
5. **Responsive from 320px to 1920px.** Layouts reflow; nothing scrolls sideways except data tables and code.

## Architecture

```
src/
  styles/
    tokens.css       Layer A: global tokens (raw values: brand ramp, greys, type, space, radius, shadow, motion)
    themes.css       Layer B: semantic tokens per theme (light, dark, high-contrast)
    tailwind.css     Maps semantic tokens to Tailwind utilities with @theme inline
    typography.css   Type ramp utilities
    components.css   Small shared utilities (focus rings, skip link, scrollbars)
  components/ui/     The component library (buttons, forms, data display, feedback, navigation, overlays, charts)
  components/shared/ App-level pieces (theme switcher, profile menu, logo, skip link)
  composables/       useTheme, useBrand, useToast, useForm, useFocusTrap, useFloating, useAnnouncer…
  layouts/           Marketing, auth, dashboard and documentation layouts
  pages/             16 example pages built only from the library
  docs/              The documentation site and playground
  design-system/     The public entry point (index.ts) used by the library build
```

## Tokens in two layers

| Layer | Example | Who reads it |
| --- | --- | --- |
| A. Global | `--ak-brand-80`, `--ak-grey-96`, `--ak-space-4`, `--ak-radius-medium` | Only themes.css |
| B. Semantic | `--ak-color-surface`, `--ak-color-text-secondary`, `--ak-color-brand-primary`, `--ak-radius-control` | Components and Tailwind utilities |

Tailwind utilities are generated from layer B, so templates use names like `bg-surface`, `text-secondary`, `border-line-subtle`, `rounded-control`, `shadow-elevation-8`, `text-body-1`.

### Brand

The 16-step brand ramp (`--ak-brand-10` … `--ak-brand-160`) is computed in OKLCH from two seeds, `--ak-brand-hue` and `--ak-brand-chroma`. Rebranding is a two-variable change; `useBrand().setBrandHex('#0f7b6c')` does it at runtime and stores it.

### Type ramp

Display 68, Large title 40, Title 1 32, Title 2 28, Title 3 24, Subtitle 1 20, Subtitle 2 16, Body 2 16, Body 1 14 (default), Caption 1 12, Caption 2 10 (px). Utilities: `text-display`, `text-title-1`, `text-body-1`, `text-body-1-strong`, `text-caption-1-strong`, and so on.

### Spacing, radius, elevation, motion

- Spacing: a 4px grid (`--ak-space-1` = 4px … `--ak-space-24` = 96px), used through Tailwind's spacing scale.
- Radius: none, 2, 4, 6, 8px and circular; semantic `--ak-radius-control` (4px), `--ak-radius-card` (8px), `--ak-radius-overlay` (8px).
- Elevation: `shadow-elevation-0/2/4/8/16/28`, re-tuned for dark mode.
- Motion: durations from 50ms to 400ms and four easing curves; all transitions collapse under `prefers-reduced-motion: reduce`.

### Breakpoints

| Name | Min width |
| --- | --- |
| xs | 425px |
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1440px |
| 3xl | 1920px |

## What is included

- **About 60 components**, listed in [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md).
- **Three themes** with a switcher and a "system" option. See [THEME_GUIDE.md](./THEME_GUIDE.md).
- **Four layouts**: marketing, authentication, dashboard (responsive sidebar, top bar, command palette) and documentation.
- **16 example pages**: home, about, contact, legal, login, register, forgot password, reset password, verify email, dashboard overview, analytics, user management, notifications, activity logs, system settings, profile, account settings and a 404 page.
- **Documentation site** at `/docs` with foundations, 26 component pages that follow the same 14-section structure, patterns, templates, resources and a playground.
