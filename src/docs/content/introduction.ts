import type { DocPages } from './types'

export const introduction: DocPages = {
  overview: {
    title: 'AkwapUI',
    lead: 'A calm, accessible design system for business software, built with Vue 3, TypeScript and Tailwind CSS v4. It draws on the principles of modern productivity design systems such as Fluent 2, expressed with its own tokens, components and brand.',
    blocks: [
      { t: 'h2', id: 'what', text: 'What is in the box' },
      {
        t: 'list',
        items: [
          '**Design tokens** in two layers: global values (`--ak-*`) and semantic roles (`--ak-color-text-primary`, `--ak-shadow-16`, …) for light, dark and high-contrast themes.',
          '**Tailwind integration** that exposes only semantic utilities such as `bg-surface`, `text-primary`, `border-default`, `rounded-control` and `shadow-elevation-8`.',
          '**60+ Vue components** covering actions, forms, overlays, navigation, data display, feedback and charts.',
          '**Four layouts** (marketing, authentication, dashboard, documentation) and **16 complete example pages** with consistent mock data.',
          '**Accessibility built in**: keyboard support, focus management, live regions and WCAG 2.1 AA contrast in every theme.',
          'A **brand engine**: change one colour and every brand tint, hover and focus state updates at runtime.',
        ],
      },
      { t: 'h2', id: 'start', text: 'Start here' },
      {
        t: 'links',
        items: [
          { label: 'Installation', to: '/docs/introduction/installation', description: 'Run the project locally and build for production.' },
          { label: 'Getting started', to: '/docs/introduction/getting-started', description: 'Build your first screen with AkwapUI components.' },
          { label: 'Colors', to: '/docs/foundations/colors', description: 'Brand ramp, semantic roles and live contrast checks.' },
          { label: 'Buttons', to: '/docs/components/button', description: 'The first component page: variants, states and API.' },
          { label: 'Playground', to: '/docs/playground', description: 'Change theme, brand, radius and sizes and copy the code.' },
          { label: 'Live dashboard', to: '/dashboard', description: 'See every component working together.' },
        ],
      },
      { t: 'callout', intent: 'info', title: 'Original work', text: 'AkwapUI is an independent project. It uses no Microsoft logos, icons, fonts or proprietary assets. Icons come from Lucide (ISC licence) and the type stack prefers system fonts.' },
    ],
  },
  principles: {
    title: 'Design principles',
    lead: 'Four principles guide every token and component decision.',
    blocks: [
      { t: 'h2', id: 'calm', text: '1. Calm by default' },
      { t: 'p', text: 'Business software is used for hours at a time. Surfaces are quiet neutrals, colour is reserved for meaning (brand for primary actions and selection, status colours for state), and elevation is used sparingly to show layering, not decoration.' },
      { t: 'h2', id: 'clear', text: '2. Clear hierarchy' },
      { t: 'p', text: 'A small type ramp, a 4px spacing grid and consistent control heights (24, 32, 40px) make screens predictable. Every page has one H1 and one primary action per region.' },
      { t: 'h2', id: 'inclusive', text: '3. Inclusive from the start' },
      { t: 'p', text: 'Accessibility is part of each component’s API, not an afterthought: labels are required where needed, focus is managed for overlays, status is never shown by colour alone, and motion respects user preferences.' },
      { t: 'h2', id: 'adaptable', text: '4. Adaptable' },
      { t: 'p', text: 'Themes and brands are data. Components read semantic tokens only, so a theme switch or a new brand colour restyles the whole product with no rebuild. Layouts reflow from 320px phones to 1920px monitors.' },
      { t: 'dodont', dos: ['Use semantic utilities (`bg-surface`, `text-secondary`).', 'Use status colours only for status.', 'Keep one primary button per region.'], donts: ['Hard-code hex values in components.', 'Use brand colour for decoration.', 'Invent one-off spacing values.'] },
    ],
  },
  installation: {
    title: 'Installation',
    lead: 'Run the AkwapUI project locally. You need Node.js 20 or newer.',
    blocks: [
      { t: 'h2', id: 'run', text: 'Run the project' },
      { t: 'code', lang: 'bash', code: 'npm install\nnpm run dev        # http://localhost:5173\nnpm run build      # type-check and production build\nnpm run preview    # serve the build' },
      { t: 'h2', id: 'tests', text: 'Run the tests' },
      { t: 'code', lang: 'bash', code: 'npm run test       # unit and component tests (Vitest)\nnpm run test:e2e   # end-to-end and accessibility tests (Playwright)\nnpm run typecheck' },
      { t: 'h2', id: 'demo', text: 'Demo accounts' },
      { t: 'p', text: 'The authentication pages use a mock service. Sign in with any email and the password `Akwap!2026`. Use `locked@akwap.example` to see a locked-account error, or `taken@akwap.example` when registering to see a duplicate-email error.' },
      { t: 'callout', intent: 'info', text: 'To use AkwapUI inside another Vue application, see [Installing in your app](/docs/resources/installation).' },
    ],
  },
  'getting-started': {
    title: 'Getting started',
    lead: 'Build a small settings card with AkwapUI components and semantic utilities.',
    blocks: [
      { t: 'h2', id: 'import', text: '1. Import components' },
      { t: 'p', text: 'Everything is exported from `@/design-system`: components, composables such as `useToast` and `useForm`, and validation rules.' },
      { t: 'code', lang: 'ts', code: "import { AkButton, AkCard, AkField, AkInput, AkSwitch, useToast } from '@/design-system'" },
      { t: 'h2', id: 'compose', text: '2. Compose a screen' },
      {
        t: 'code',
        title: 'NotificationSettings.vue',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { AkButton, AkCard, AkField, AkInput, AkSwitch, useToast } from '@/design-system'

const email = ref('amina@akwap.example')
const digest = ref(true)
const toast = useToast()
</script>

<template>
  <AkCard title="Notifications" subtitle="Choose how we contact you">
    <div class="flex flex-col gap-stack">
      <AkField label="Notification email">
        <AkInput v-model="email" type="email" />
      </AkField>
      <AkSwitch v-model="digest" label="Daily digest" />
    </div>
    <template #footer>
      <AkButton variant="primary" @click="toast.success('Saved')">Save</AkButton>
    </template>
  </AkCard>
</template>`,
      },
      { t: 'h2', id: 'style', text: '3. Style with semantic utilities' },
      { t: 'p', text: 'Tailwind’s default palette is removed, so only design tokens are available. Use roles, not colours: `bg-surface`, `text-secondary`, `border-subtle`, `rounded-card`, `shadow-elevation-4`, `p-card`, `gap-stack`.' },
      { t: 'h2', id: 'theme', text: '4. Add theme switching' },
      { t: 'code', code: `<script setup lang="ts">
import { AkThemeSwitcher } from '@/design-system'
</script>

<template>
  <AkThemeSwitcher />  <!-- light, dark, high contrast or system; remembered per browser -->
</template>` },
      { t: 'links', items: [{ label: 'Forms pattern', to: '/docs/patterns/forms', description: 'Validation, errors and submit states with useForm.' }, { label: 'Theming', to: '/docs/resources/theming', description: 'Themes, brand colour and custom tokens.' }] },
    ],
  },
  architecture: {
    title: 'Project architecture',
    lead: 'How the repository is organised and how the layers depend on each other.',
    blocks: [
      { t: 'h2', id: 'tree', text: 'Folder structure' },
      {
        t: 'code',
        lang: 'bash',
        code: `src/
  styles/          tokens.css, themes.css, tailwind.css, typography.css, components.css
  design-system/   public API barrel (components, composables, types, plugin)
  components/
    ui/            buttons, forms, overlays, navigation, data-display, feedback, charts
    shared/        logo, theme switcher, skip link, live region, profile menu
    layout/        page header, settings row
  layouts/         Marketing, Auth, Dashboard, Documentation
  pages/           auth, account, marketing, dashboard, users, analytics, settings
  composables/     useTheme, useBrand, useForm, useToast, useFocusTrap, useFloating, …
  services/        mock API and deterministic mock data
  stores/          session, users, notifications
  router/          app routes and docs routes
  docs/            documentation site: registry, examples, content, playground
  utils/           formatting, validation, colour maths, CSV
tests/
  unit/            Vitest component and composable tests
  e2e/             Playwright flows, theme, responsive and axe checks
docs/              Markdown guides (design system, theming, accessibility, …)`,
      },
      { t: 'h2', id: 'layers', text: 'Layers' },
      {
        t: 'table',
        caption: 'Architecture layers',
        head: ['Layer', 'Depends on', 'Rule'],
        rows: [
          ['Global tokens', '—', 'Raw values only. Never used by components directly.'],
          ['Semantic tokens', 'Global tokens', 'One set per theme. The only colours components use.'],
          ['Tailwind theme', 'Semantic tokens', '`@theme inline` maps roles to utilities.'],
          ['Components', 'Utilities, composables', 'No page or service imports.'],
          ['Layouts and pages', 'Components, stores, services', 'Compose components; no new visual styles.'],
        ],
      },
    ],
  },
}
