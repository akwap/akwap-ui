# Changelog

All notable changes to AkwapUI are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [semantic versioning](https://semver.org/).

## [Unreleased]

### Added

- Django integration (`integrations/django`, guide in `docs/DJANGO.md`): an `akwapui-django` app with component template tags, `.ak-*` component classes, an accessible form renderer, the theme switcher and brand colour, the icon set as inline SVG, a Tailwind setup command and a prebuilt stylesheet for apps without Node, plus `{% ak_island %}` for mounting Vue components into Django pages. Includes an example project and 31 tests. `npm run build:django` regenerates the package's CSS and icons from the design system.
- Accent colour palette: 12 hues (red, orange, amber, lime, green, teal, cyan, blue, indigo, purple, magenta, pink) generated in OKLCH, with theme-aware text, fill, tint and border roles for light, dark and high contrast, Tailwind utilities, and `accentFor()` for stable colours per category. Contrast is at least 5.6:1 for every text pairing.
- `AkBadge` accepts accent colours; `AkAvatar` uses the accent palette for initials and takes a `color` prop.
- `AkIcon` component with six sizes, role and accent colours, and an optional accessible label.
- The AkwapUI icon set: 84 semantic names grouped into actions, navigation, status, objects, data and appearance (`icons`, `iconGroups`).
- Icons foundation page with the semantic set and a searchable library of all 2,000+ Lucide icons (size and stroke previews, copy import). The library is a separate data chunk loaded only on that page.
- Icon component documentation page, accent colour documentation, and tests for both.

### Changed

- Avatar initials now use the accent palette instead of mixing chart colours.

### Fixed

- Filled success, warning and info badges (and status indicator glyphs) did not reach 4.5:1 contrast in some themes. They now use a new `on-status` text colour, and the light theme's `warning-strong` is one step darker.

## [1.0.0] - 2026-11-10

First complete release.

### Added

- Two-layer design tokens: global values (OKLCH brand ramp, greys, type, spacing, radius, elevation, motion, z-index) and semantic tokens per theme, mapped to Tailwind v4 utilities.
- Light, dark and high-contrast themes, a theme switcher with a "system" option, no flash on load, and runtime brand colour changes.
- About 60 components across buttons, forms, date and time, file upload, data display, feedback, overlays, navigation, disclosure and charts, plus composables for theme, brand, toasts, forms, focus trapping, positioning and announcements.
- Marketing, authentication, dashboard and documentation layouts, with a responsive sidebar, command palette (Ctrl/⌘ + K) and keyboard shortcuts.
- 16 example pages and a 404 page using mock data.
- Documentation site with 67 pages: introduction, foundations with live token previews, 26 component pages that follow a 14-section structure with 76 live examples, patterns, templates and resources.
- Component playground with an isolated live preview (theme, brand, radius, button and input options, responsive widths) and generated Vue and CSS code.
- Library build (`npm run build:lib`) with ES module, CSS, Tailwind source and type declarations, verified in a separate Vite app.
- 45 unit and component tests (Vitest) and 255 end-to-end tests (Playwright): every route at 320px, app routes at 768 and 1440px, key user flows, and axe WCAG 2.1 AA checks on 17 pages in light and dark.

### Fixed during release testing

- Buttons and cards with `to` rendered without an `href`, so they could not be reached by keyboard.
- `AkConfirmDialog` ran its confirm handler twice.
- Avatar initials did not meet 4.5:1 contrast for some colours.
- The profile menu's accessible name did not include its visible text.

## Progress checklist

| Phase | Scope | Status |
| --- | --- | --- |
| 0 | Project setup: Vue 3, Vite, TypeScript, Tailwind v4, router, folder structure | Done |
| 1 | Design tokens (two layers) and Tailwind mapping | Done |
| 2 | Light, dark and high-contrast themes; theme switcher; brand colour | Done |
| 3 | Core components: buttons, inputs, selection, field and validation | Done |
| 4 | Data display, feedback, overlays, navigation, charts | Done |
| 5 | Layouts: marketing, auth, dashboard, documentation | Done |
| 6 | Example pages (16 + 404) | Done |
| 7 | Documentation site, 14-section component pages, live examples, playground | Done |
| 8 | Unit, end-to-end, responsive and accessibility tests; production and library builds | Done |
| 9 | Markdown documentation | Done |
| 10 | Accent colour palette and icon system | Done |

### Not done yet

- Manual screen reader testing (NVDA, JAWS, VoiceOver, TalkBack).
- Right-to-left layout support.
- Publishing the package to a registry.
- Visual regression tests.
