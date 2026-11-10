# Theme guide

AkwapUI has three themes, selected with a `data-theme` attribute on `<html>`:

| Theme | Attribute | Notes |
| --- | --- | --- |
| Light | `data-theme="light"` | Default; also applies to `:root` with no attribute |
| Dark | `data-theme="dark"` | Separate token values, not an inversion; shadows are re-tuned |
| High contrast | `data-theme="high-contrast"` | Black background, white text, yellow brand and focus, visible borders on every control |

## Switching themes

```ts
import { useTheme } from 'akwapui'

const { preference, resolved, setTheme, toggle, themes } = useTheme()
setTheme('dark')            // 'light' | 'dark' | 'high-contrast' | 'system'
toggle()                    // light ↔ dark
resolved.value              // the theme actually applied
```

- The choice is stored in `localStorage` under `akwapui:theme`.
- `system` follows `prefers-color-scheme`, and picks high contrast when the OS reports `forced-colors: active`.
- `<AkThemeSwitcher />` is a ready-made menu with all four options.
- The inline script in [INSTALLATION.md](./INSTALLATION.md) applies the stored theme before first paint.

## Brand colour

The brand ramp is generated from two numbers:

```css
:root {
  --ak-brand-hue: 252;    /* OKLCH hue, 0–360 */
  --ak-brand-chroma: 0.15; /* 0.02–0.2 keeps every step in gamut and accessible */
}
```

At runtime:

```ts
import { useBrand } from 'akwapui'
const { brand, setBrandHex, resetBrand } = useBrand()
setBrandHex('#0f7b6c')       // converts to OKLCH, clamps chroma, applies and stores it ('akwapui:brand')
setBrandHex('#0f7b6c', false) // apply without storing
resetBrand()
```

The playground (`/docs/playground`) lets you try a brand colour and radius in an isolated preview, then copy the generated CSS or apply it to the whole site.

## Radius

```css
:root {
  --ak-radius-control: 4px;  /* buttons, inputs, menus items */
  --ak-radius-card: 8px;     /* cards, tables */
  --ak-radius-overlay: 8px;  /* dialogs, drawers, popovers */
}
```

## Adding or overriding a theme

1. Copy the `[data-theme='light']` block in `src/styles/themes.css`.
2. Give it a new selector, for example `[data-theme='sepia']`, and set `color-scheme`.
3. Override the semantic tokens (`--ak-color-*`). Reference global tokens (`--ak-grey-*`, `--ak-brand-*`) rather than hard-coding values where you can.
4. Check contrast: body text 4.5:1, large text and UI boundaries 3:1. The Colors foundation page (`/docs/foundations/colors`) shows live contrast ratios for the current theme.
5. Add the name to `ThemePreference` in `src/composables/useTheme.ts` if it should appear in the switcher.

## Semantic colour tokens

| Group | Tokens |
| --- | --- |
| Brand | `brand-primary`, `brand-hover`, `brand-pressed`, `brand-selected`, `brand-secondary`, `brand-subtle`, `brand-subtle-hover`, `brand-foreground`, `brand-stroke`, `on-brand` |
| Surfaces | `background`, `background-secondary`, `surface`, `surface-secondary`, `surface-tertiary`, `surface-hover`, `surface-pressed`, `surface-selected`, `surface-inverse`, `surface-overlay`, `backdrop` |
| Text | `text-primary`, `text-secondary`, `text-tertiary`, `text-disabled`, `text-inverse`, `text-link`, `text-link-hover` |
| Borders | `border`, `border-subtle`, `border-strong`, `border-hover`, `border-disabled`, `border-focus`, `border-focus-inner` |
| Status | `success`, `warning`, `danger`, `info`, each with `-background`, `-border` and `-strong` |
| Data | `data-1` … `data-6`, `chart-grid` |

All are prefixed `--ak-color-`, and each has a Tailwind utility (`bg-surface`, `text-secondary`, `border-line-subtle`, `text-danger`, `bg-success-background`…).
