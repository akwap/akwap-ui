# Accessibility

AkwapUI targets **WCAG 2.1 level AA**. This page lists what the components do for you, what you still need to do, and how conformance is tested.

## Built in

- **Keyboard.** Every interactive element is reachable and operable by keyboard. Menus, tabs, radio groups, segmented controls, listboxes, calendars and the command palette use arrow-key navigation with roving focus, following the ARIA Authoring Practices patterns. Each component page lists its keys.
- **Focus.** A 2px focus ring (with an inner contrast ring) appears on keyboard focus only. Dialogs and drawers trap focus, close on Escape, lock page scroll and return focus to the element that opened them.
- **Skip link.** The first tab stop on every layout is "Skip to main content", which moves focus to `<main>`.
- **Labels and messages.** `AkField` links label, helper text and error message to its control with `for`, `aria-describedby` and `aria-invalid`. Required markers are hidden from screen readers; the control is marked `required`.
- **Validation.** Forms validate on blur, then live while fixing. On submit, focus moves to the first invalid field.
- **Live regions.** Toasts, result counts, route changes and async states are announced through polite live regions (`useAnnouncer`). Loading buttons and tables set `aria-busy`.
- **Colour.** Text tokens meet 4.5:1 and UI boundaries 3:1 against their surfaces in light and dark. Status is never conveyed by colour alone: alerts, badges and toasts pair colour with an icon and text, and charts include a legend and a data table alternative.
- **High contrast.** A dedicated theme, selected automatically when the OS reports `forced-colors: active` and the preference is "system".
- **Motion.** All transitions collapse under `prefers-reduced-motion: reduce`, including scroll-to-anchor.
- **Reflow and zoom.** Layouts work from 320px wide without horizontal page scroll; text scales with browser zoom. Small controls are at least 24px tall; navigation items are 36px and large controls 40px. (WCAG 2.1 AA has no target-size requirement; 44px targets are a level AAA goal.)
- **Route changes.** The document title updates and the new page title is announced on navigation.

## Your responsibilities

- Give icon-only buttons an `aria-label`.
- Write link and button text that makes sense on its own ("Export report", not "Click here").
- Keep heading levels in order; components with a `heading-level` prop let you set the right level.
- Provide `alt` text for meaningful images, and `decorative` on avatars that sit next to the person's name.
- Write error messages that say how to fix the problem.
- Do not disable paste in password fields.

## How it is tested

| Check | Tool | Scope |
| --- | --- | --- |
| Automated WCAG 2.0/2.1 A and AA rules | axe-core via `@axe-core/playwright` | 17 representative pages (marketing, auth, dashboard, account, docs, playground) in light and dark themes |
| No horizontal overflow, no console errors | Playwright | Every application and documentation route at 320px; application routes at 768px and 1440px |
| Keyboard flows | Playwright | Skip link, dialog focus trap and restore, command palette, mobile drawer, sortable table `aria-sort` |
| Component behaviour | Vitest + Vue Test Utils | Field wiring, dialog focus and Escape, tabs keys, table sorting and selection, validation |

Run them with `npm test` and `npm run test:e2e`.

### Known gaps

- Automated tools find roughly a third of accessibility issues. Screen reader testing with NVDA, JAWS, VoiceOver and TalkBack has **not** been done yet and is recommended before production use.
- The high-contrast theme is checked for layout but is not part of the automated axe run.
- Right-to-left layouts are not supported yet.
- SVG charts provide a data table alternative but do not support keyboard exploration of individual points.
