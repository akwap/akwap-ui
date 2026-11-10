import type { DocPages } from './types'

export const resources: DocPages = {
  installation: {
    title: 'Installing in your app',
    lead: 'Use AkwapUI in another Vue 3 application, either as the prebuilt library or by copying the source.',
    blocks: [
      { t: 'h2', id: 'library', text: 'Option A: the library build' },
      { t: 'p', text: 'Build the package once. It outputs an ES module with all components and composables, a single CSS file with tokens, themes and utilities, and type declarations.' },
      { t: 'code', lang: 'bash', code: 'npm run build:lib\n# dist-lib/akwapui.js, dist-lib/style.css, dist-lib/types/' },
      { t: 'p', text: 'In your app, install the peer dependencies and import the CSS once:' },
      { t: 'code', lang: 'bash', code: 'npm install vue vue-router @lucide/vue\nnpm install ../akwapui   # or publish dist-lib to your registry' },
      {
        t: 'code',
        lang: 'ts',
        title: 'main.ts',
        code: `import { createApp } from 'vue'
import AkwapUI from 'akwapui'
import 'akwapui/style.css'
import App from './App.vue'

createApp(App).use(router).use(AkwapUI).mount('#app') // registers every Ak* component`,
      },
      { t: 'p', text: 'Or import only what you need: `import { AkButton, useToast } from \'akwapui\'`.' },
      { t: 'callout', intent: 'warning', title: 'Router required', text: 'Components that navigate (`AkButton` with `to`, `AkNavList`, `AkBreadcrumb`, `AkLink`) use vue-router, so install a router in the host app.' },
      { t: 'h2', id: 'tailwind', text: 'Using the utilities in your own templates' },
      { t: 'p', text: 'The prebuilt CSS only contains utilities AkwapUI itself uses. To write `bg-surface` or `text-secondary` in your own templates, run Tailwind v4 in your app and import the AkwapUI theme as its source:' },
      {
        t: 'code',
        lang: 'css',
        title: 'src/styles.css',
        code: `@import 'akwapui/tailwind.css';   /* tokens, themes, @theme mapping, utilities */
@source '../node_modules/akwapui/dist-lib';`,
      },
      { t: 'h2', id: 'source', text: 'Option B: copy the source' },
      { t: 'list', ordered: true, items: ['Copy `src/styles`, `src/components/ui`, `src/components/shared`, `src/composables`, `src/utils` and `src/design-system` into your project.', 'Add `@tailwindcss/vite` to your Vite config and an `@` alias to `src`.', 'Import `src/styles/tailwind.css` once in `main.ts`.', 'Copy the inline theme script from `index.html` to avoid a flash of the wrong theme.'] },
    ],
  },
  configuration: {
    title: 'Configuration',
    lead: 'Everything is configured with CSS custom properties and Tailwind v4’s CSS-first `@theme`. There is no JavaScript config file.',
    blocks: [
      { t: 'h2', id: 'files', text: 'The style entry' },
      { t: 'code', lang: 'css', code: `@import 'tailwindcss';
@import './tokens.css';   /* layer A: raw values (--ak-*) */
@import './themes.css';   /* layer B: semantic roles per theme */

@theme inline {
  --color-*: initial;      /* remove Tailwind's palette */
  --color-surface: var(--ak-color-surface);
  --text-color-primary: var(--ak-color-text-primary);
  --radius-control: var(--ak-radius-control);
  --shadow-elevation-8: var(--ak-shadow-8);
  /* … */
}` },
      { t: 'p', text: '`@theme inline` makes each utility compile to `var(--ak-…)`, so changing a variable at runtime (theme switch, brand colour, radius) restyles everything instantly.' },
      { t: 'h2', id: 'storage', text: 'Persisted preferences' },
      { t: 'table', caption: 'Local storage keys', head: ['Key', 'Value'], rows: [['`akwapui:theme`', '`light`, `dark`, `high-contrast` or `system`'], ['`akwapui:brand`', '`{ hue, chroma, hex }` brand seed'], ['`akwapui:sidebar-collapsed`', 'Dashboard sidebar state']] },
    ],
  },
  theming: {
    title: 'Theming',
    lead: 'Three themes ship by default: light, dark and high contrast. Themes are selected with a `data-theme` attribute on `<html>`.',
    blocks: [
      { t: 'h2', id: 'switch', text: 'Switching themes' },
      { t: 'code', lang: 'ts', code: `import { useTheme } from '@/design-system'

const { preference, resolved, setTheme } = useTheme()
setTheme('dark')           // 'light' | 'dark' | 'high-contrast' | 'system'
resolved.value             // the theme actually applied` },
      { t: 'p', text: '`system` follows `prefers-color-scheme` and switches to high contrast when the OS uses forced colours. The choice is stored per browser and applied by an inline script before first paint.' },
      { t: 'h2', id: 'brand', text: 'Changing the brand colour' },
      { t: 'code', lang: 'ts', code: `import { useBrand } from '@/design-system'

const { setBrandHex, resetBrand } = useBrand()
setBrandHex('#0f7b6c')    // regenerates the 16-step OKLCH ramp` },
      { t: 'p', text: 'Or set it in CSS without JavaScript:' },
      { t: 'code', lang: 'css', code: `:root {
  --ak-brand-hue: 168;     /* OKLCH hue */
  --ak-brand-chroma: 0.12; /* saturation; keep ≤ 0.2 */
}` },
      { t: 'callout', intent: 'info', text: 'Try it on the [playground](/docs/playground) or in [System settings](/dashboard/settings). Chroma is clamped so text on brand fills keeps 4.5:1 contrast.' },
      { t: 'h2', id: 'custom', text: 'Creating a theme' },
      { t: 'code', lang: 'css', code: `[data-theme='sepia'] {
  color-scheme: light;
  --ak-color-background: #f4ecd8;
  --ak-color-surface: #fbf6ea;
  --ak-color-text-primary: #3b2f20;
  /* override any other --ak-color-* role */
}` },
      { t: 'p', text: 'Start from the light block in `themes.css`, override only what changes, and check contrast on the [Colors](/docs/foundations/colors) page.' },
    ],
  },
  'component-api': {
    title: 'Component API conventions',
    lead: 'All components follow the same conventions, so once you know one you can predict the rest.',
    blocks: [
      { t: 'table', caption: 'API conventions', head: ['Convention', 'Example'], rows: [
        ['`v-model` for the main value', '`<AkInput v-model="name" />`, `<AkTabs v-model="tab" />`'],
        ['`v-model:open` for overlays', '`<AkDialog v-model:open="show" />`'],
        ['`size`: sm, md, lg', 'Controls are 24, 32 and 40px tall'],
        ['`variant` or `appearance` for emphasis', '`variant="primary"`, `appearance="tint"`'],
        ['`intent` for meaning', '`intent="danger"` on alerts, toasts and progress'],
        ['`disabled`, `invalid`, `loading` booleans', 'Map to native attributes and ARIA'],
        ['Slots for structure', '`#footer="{ close }"`, `#cell-name="{ row }"`, `#trigger="{ attrs }"`'],
        ['`label` for accessible names', 'Required on segmented controls, groups and charts (`summary`)'],
        ['Attribute fallthrough', 'Extra attributes such as `data-testid` or `aria-*` go to the main element'],
      ] },
      { t: 'p', text: 'Every component page lists its full props, events and slots, for example [Button](/docs/components/button) or [Data table](/docs/components/table).' },
    ],
  },
  customization: {
    title: 'Customization',
    lead: 'Customise with tokens first, utilities second, and new components last.',
    blocks: [
      { t: 'h2', id: 'tokens', text: '1. Override tokens' },
      { t: 'code', lang: 'css', code: `:root {
  --ak-radius-control: 8px;   /* rounder controls */
  --ak-radius-card: 12px;
  --ak-font-family-base: 'Inter', system-ui, sans-serif;
}` },
      { t: 'h2', id: 'classes', text: '2. Add utilities' },
      { t: 'p', text: 'Components accept `class`, merged onto their root, for layout tweaks such as width and margin: `<AkButton class="w-full sm:w-auto">`.' },
      { t: 'h2', id: 'compose', text: '3. Compose, then extend' },
      { t: 'p', text: 'Build product components out of Ak components (as `PageHeader` and `SettingsRow` do). Only create a new primitive when no combination works, and give it the same props conventions.' },
      { t: 'dodont', dos: ['Change `--ak-radius-*` to adjust shape globally.', 'Wrap Ak components for product-specific patterns.'], donts: ['Override component internals with deep selectors.', 'Add colours outside the token system.'] },
    ],
  },
  'best-practices': {
    title: 'Best practices',
    lead: 'Guidelines that keep products built with AkwapUI consistent and accessible.',
    blocks: [
      { t: 'list', items: [
        'Use one primary action per region and write action labels as verbs.',
        'Prefer semantic utilities over arbitrary values; if you reach for `[#hex]` or `[13px]`, add a token instead.',
        'Give every page one H1 and keep headings in order.',
        'Test each new screen at 320px, at 200% zoom, with the keyboard only, and in dark and high-contrast themes.',
        'Show loading, empty and error states for every data view.',
        'Keep copy short, in sentence case, and specific.',
        'Never rely on colour alone: add icons, text or patterns.',
      ] },
    ],
  },
  migration: {
    title: 'Migration guide',
    lead: 'Moving an existing Tailwind app to AkwapUI, step by step.',
    blocks: [
      { t: 'list', ordered: true, items: [
        'Upgrade to Tailwind CSS v4 and move configuration into CSS.',
        'Import the AkwapUI entry. Because the default palette is removed, unknown colour classes stop working: search for them and map them to roles.',
        'Replace hand-rolled buttons, inputs and dialogs with Ak components page by page.',
        'Wrap form controls in `AkField` to get labels and error messages.',
        'Remove custom dark-mode classes; themes come from tokens.',
      ] },
      { t: 'table', caption: 'Class mapping', head: ['Before', 'After'], rows: [
        ['`bg-white` / `dark:bg-gray-900`', '`bg-surface`'],
        ['`bg-gray-50`', '`bg-background` or `bg-surface-secondary`'],
        ['`text-gray-900`', '`text-primary`'],
        ['`text-gray-500`', '`text-secondary` (or `text-tertiary` for captions)'],
        ['`border-gray-200`', '`border-subtle`'],
        ['`bg-blue-600 text-white`', '`bg-brand text-on-brand`'],
        ['`text-red-600`', '`text-danger`'],
        ['`rounded-md` on inputs', '`rounded-control`'],
        ['`shadow-lg`', '`shadow-elevation-16`'],
      ] },
    ],
  },
  testing: {
    title: 'Testing',
    lead: 'AkwapUI is tested at three levels: unit tests for logic and components, end-to-end flows in a real browser, and automated accessibility checks.',
    blocks: [
      { t: 'code', lang: 'bash', code: 'npm run test        # Vitest + Vue Test Utils (jsdom)\nnpm run test:e2e    # Playwright in Chromium\nnpm run typecheck   # vue-tsc' },
      { t: 'table', caption: 'Test suites', head: ['Suite', 'Covers'], rows: [
        ['`tests/unit`', 'Buttons, fields and validation, dialogs (focus and Esc), tabs keyboard, data table sorting and selection, theme persistence, validation rules, colour maths'],
        ['`tests/e2e/routes`', 'Every route loads without console errors'],
        ['`tests/e2e/flows`', 'Login validation and success, user management dialog, theme switching, mobile navigation'],
        ['`tests/e2e/responsive`', 'No horizontal overflow at 320px on every route'],
        ['`tests/e2e/a11y`', 'axe-core WCAG 2.1 AA checks on key pages in light and dark'],
      ] },
      { t: 'h2', id: 'write', text: 'Writing tests for your screens' },
      { t: 'code', lang: 'ts', code: `import { mount } from '@vue/test-utils'
import { AkButton } from '@/design-system'

it('shows a loading state', () => {
  const w = mount(AkButton, { props: { loading: true }, slots: { default: 'Save' } })
  expect(w.attributes('aria-busy')).toBe('true')
})` },
      { t: 'p', text: 'Query by role and label in end-to-end tests (`getByRole(\'button\', { name: \'Save\' })`); this checks accessibility at the same time.' },
    ],
  },
  faq: {
    title: 'FAQ',
    lead: 'Answers to common questions.',
    blocks: [
      { t: 'h3', text: 'Is AkwapUI affiliated with Microsoft or Fluent?' },
      { t: 'p', text: 'No. It is an independent design system inspired by the principles of modern productivity design systems. It uses its own tokens, components, icons (Lucide) and brand, and no proprietary assets.' },
      { t: 'h3', text: 'Can I use it with React?' },
      { t: 'p', text: 'The tokens, themes and Tailwind configuration are framework-agnostic CSS and work anywhere. The components are Vue 3.' },
      { t: 'h3', text: 'Why is the Tailwind colour palette removed?' },
      { t: 'p', text: 'So that only design tokens can be used. This keeps colours consistent and guarantees that theme and brand changes reach every element.' },
      { t: 'h3', text: 'How do I support right-to-left languages?' },
      { t: 'p', text: 'Right-to-left has not been fully audited yet. Flex and grid layouts mirror with `dir="rtl"`, but some components still use physical offsets (`ml-*`, `pl-*`) and directional icons, so test RTL screens before shipping.' },
      { t: 'h3', text: 'Does it need a backend?' },
      { t: 'p', text: 'No. The example pages use deterministic mock services in `src/services`; replace them with your API calls.' },
    ],
  },
}
