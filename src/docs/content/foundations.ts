import ColorPalette from '../foundations/ColorPalette.vue'
import SemanticColors from '../foundations/SemanticColors.vue'
import AccentColors from '../foundations/AccentColors.vue'
import TypeRamp from '../foundations/TypeRamp.vue'
import SpacingScale from '../foundations/SpacingScale.vue'
import RadiusScale from '../foundations/RadiusScale.vue'
import ElevationScale from '../foundations/ElevationScale.vue'
import IconGallery from '../foundations/IconGallery.vue'
import MotionDemo from '../foundations/MotionDemo.vue'
import BreakpointDemo from '../foundations/BreakpointDemo.vue'
import type { DocPages } from './types'

export const foundations: DocPages = {
  colors: {
    title: 'Colors',
    lead: 'Colour is defined twice: global palettes hold raw values, and semantic roles say what a colour is for. Components only use semantic roles, which is why themes and brands can change at runtime.',
    blocks: [
      { t: 'h2', id: 'semantic', text: 'Semantic roles' },
      { t: 'p', text: 'Values and contrast ratios below are measured live in the current theme. Use the theme switcher in the header to compare light, dark and high contrast.' },
      { t: 'component', is: SemanticColors },
      { t: 'h2', id: 'accent', text: 'Accent colours' },
      { t: 'p', text: 'Twelve accent hues are for categories, tags, avatars, labels and illustrations: anything that needs to be told apart but carries no status meaning. Each hue has four roles that adapt to the theme: `text-<hue>` for text and icons, `bg-<hue>-background` for tints, `border-<hue>-border`, and `bg-<hue>-strong` for fills with `text-on-accent`. Contrast is measured live below.' },
      { t: 'component', is: AccentColors },
      { t: 'code', lang: 'vue', code: `<AkBadge color="teal">Finance</AkBadge>
<AkAvatar name="Wanjiru Kamau" color="purple" />
<span class="rounded-sm border border-indigo-border bg-indigo-background px-2 text-indigo">Beta</span>

<script setup lang="ts">
import { accentFor } from '@/design-system'
const color = accentFor(project.id) // the same project always gets the same hue
</script>` },
      { t: 'h2', id: 'palettes', text: 'Global palettes' },
      { t: 'component', is: ColorPalette },
      { t: 'h2', id: 'rules', text: 'Rules' },
      { t: 'list', items: ['Text on surfaces must reach 4.5:1 (3:1 for 18px+ or 14px bold). Every role above is tuned for this in all three themes.', 'Never communicate state with colour alone: pair status colours with an icon or text.', 'Brand colour marks primary actions, selection and focus. Do not use it for large decorative areas.', 'Charts use the dedicated data palette, never status colours.', 'Accent colours mean “this is a different category”, never “good” or “bad”: use the status roles for that.', 'Assign accents from a stable key (`accentFor(id)`) so an item keeps its colour across screens.'] },
      { t: 'dodont', dos: ['Use `text-secondary` for supporting text.', 'Use `bg-danger-background` with an icon for errors.'], donts: ['Use `text-tertiary` for body text.', 'Put brand text on brand-subtle backgrounds at small sizes without checking contrast.'] },
    ],
  },
  typography: {
    title: 'Typography',
    lead: 'A system font stack led by Segoe UI, with a compact ramp from 10px captions to fluid display titles.',
    blocks: [
      { t: 'h2', id: 'ramp', text: 'Type ramp' },
      { t: 'component', is: TypeRamp },
      { t: 'h2', id: 'fonts', text: 'Font stacks' },
      { t: 'code', lang: 'css', code: `--ak-font-family-base: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', 'Noto Sans', Arial, sans-serif;
--ak-font-family-mono: 'Cascadia Code', Consolas, 'SF Mono', 'Roboto Mono', Menlo, monospace;` },
      { t: 'p', text: 'No web fonts are downloaded. Each platform uses its native UI font, which keeps pages fast and familiar.' },
      { t: 'h2', id: 'usage', text: 'Usage' },
      { t: 'list', items: ['One `text-title-1` (H1) per page; section headings use `text-title-3` or `text-subtitle-1`.', 'Body copy is `text-body-1` (14px) in apps and `text-body-2` (16px) for reading-heavy pages.', 'Keep line length under about 75 characters with `max-w-3xl` on prose.', 'Text is set in rem-free pixel tokens but scales with browser zoom; layouts are tested at 200% zoom.'] },
    ],
  },
  spacing: {
    title: 'Spacing',
    lead: 'All spacing is a multiple of 4px. Tailwind’s spacing unit is 4px, so `p-4` is 16px and `gap-2` is 8px, plus named semantic spacings.',
    blocks: [
      { t: 'component', is: SpacingScale },
      { t: 'h2', id: 'rules', text: 'Rules' },
      { t: 'list', items: ['Related items sit closer together than unrelated ones (8px inside a group, 16–24px between groups).', 'Form fields stack with `gap-stack` (16px).', 'Page gutters are 16px on phones and 24px from 640px.'] },
    ],
  },
  grid: {
    title: 'Grid system',
    lead: 'Layouts use CSS grid and flexbox with a 4 / 8 / 12 column rhythm and seven breakpoints.',
    blocks: [
      { t: 'component', is: BreakpointDemo },
      { t: 'h2', id: 'breakpoints', text: 'Breakpoints' },
      {
        t: 'table',
        caption: 'Breakpoints',
        head: ['Prefix', 'Min width', 'Typical device'],
        rows: [
          ['(none)', '0', '320–424px phones'],
          ['`xs:`', '425px', 'Large phones'],
          ['`sm:`', '640px', 'Small tablets, landscape phones'],
          ['`md:`', '768px', 'Tablets'],
          ['`lg:`', '1024px', 'Laptops'],
          ['`xl:`', '1280px', 'Desktops'],
          ['`2xl:`', '1440px', 'Large desktops'],
          ['`3xl:`', '1920px', 'Wide monitors'],
        ],
      },
      { t: 'h2', id: 'tips', text: 'Avoiding overflow' },
      { t: 'list', items: ['Use `grid-cols-1` as the base and add columns at breakpoints.', 'Use `minmax(0,1fr)` (or `min-w-0` on flex children) so long text and tables cannot push the page wider than the screen.', 'Wrap wide tables in a scroll region rather than letting the page scroll sideways.'] },
    ],
  },
  radius: {
    title: 'Border radius',
    lead: 'Corners are restrained: 4px for controls and 8px for cards and overlays. Role-based radii can be changed globally.',
    blocks: [
      { t: 'component', is: RadiusScale },
      { t: 'p', text: 'Components use the role utilities (`rounded-control`, `rounded-card`, `rounded-overlay`). Change `--ak-radius-control` and friends (try the [playground](/docs/playground)) to make the whole product sharper or softer.' },
    ],
  },
  elevation: {
    title: 'Elevation',
    lead: 'Six shadow levels show how far a surface sits above the page. Each combines a soft ambient shadow with a sharper key shadow.',
    blocks: [
      { t: 'component', is: ElevationScale },
      { t: 'list', items: ['Dark theme shadows are deeper because shadows are harder to see on dark surfaces.', 'High contrast removes shadows and relies on borders instead.', 'Do not combine elevation with heavy borders.'] },
    ],
  },
  icons: {
    title: 'Icons',
    lead: 'AkwapUI uses Lucide icons (ISC licence) at a 1.75 stroke weight. The AkwapUI set gives each common meaning one agreed icon; the full library has over 2,000 more. Click an icon to copy its code.',
    blocks: [
      { t: 'component', is: IconGallery },
      { t: 'h2', id: 'usage', text: 'Usage' },
      { t: 'p', text: 'Use `AkIcon` with a semantic name from the AkwapUI set, so the same action looks the same everywhere. For anything else, import the Lucide icon by name and pass it to `icon`. Named imports keep bundles small: only the icons you use are shipped.' },
      { t: 'code', lang: 'vue', code: `<script setup lang="ts">
import { Rocket } from '@lucide/vue'
import { AkButton, AkIcon, icons } from '@/design-system'
</script>

<template>
  <AkIcon name="delete" />                          <!-- decorative, 20px -->
  <AkIcon name="warning" color="warning" label="Warning" />  <!-- announced -->
  <AkIcon :icon="Rocket" size="lg" color="purple" />
  <AkButton :icon="icons.download">Export</AkButton>
</template>` },
      { t: 'table', caption: 'Icon sizes', head: ['Size', 'Pixels', 'Use for'], rows: [['`xs`', '12', 'Inside small badges'], ['`sm`', '16', 'Inline with body text, small buttons'], ['`md`', '20', 'Buttons, inputs, navigation (default)'], ['`lg`', '24', 'Standalone icons, large buttons'], ['`xl`', '32', 'Feature lists, cards'], ['`2xl`', '48', 'Empty states and illustrations']] },
      { t: 'h2', id: 'rules', text: 'Rules' },
      { t: 'list', items: ['Icons next to visible text are decorative. `AkIcon` hides them from screen readers unless you pass `label`.', 'Icon-only controls need an accessible name: `aria-label` on the button, or a label tooltip.', 'Use the semantic name when one exists (`delete`, not a random bin icon), so meaning stays consistent.', 'Colour an icon with a role (`color="danger"`) only when the colour adds meaning, and never rely on colour alone.', 'Keep one stroke weight per screen; do not mix outline and filled styles.'] },
      { t: 'links', items: [{ label: 'Icon component', to: '/docs/components/icon', description: 'Props, sizes, colours and accessibility for AkIcon.' }] },
    ],
  },
  motion: {
    title: 'Motion',
    lead: 'Motion is quick and purposeful: it explains where things come from and go to, then gets out of the way.',
    blocks: [
      { t: 'component', is: MotionDemo },
      { t: 'h2', id: 'usage', text: 'Usage' },
      { t: 'table', caption: 'Motion usage', head: ['Interaction', 'Duration', 'Easing'], rows: [['Hover and colour changes', '`duration-faster` (100ms)', 'standard'], ['Menus, tooltips, popovers', '`duration-fast` (150ms)', 'decelerate'], ['Dialogs and drawers', '`duration-normal`–`slow`', 'decelerate in, accelerate out'], ['Toasts', '`duration-normal`', 'decelerate']] },
      { t: 'callout', intent: 'info', title: 'Reduced motion', text: 'When the OS asks for reduced motion, or the user turns it on in Account settings, all transitions and animations are reduced to near zero, and smooth scrolling is turned off.' },
    ],
  },
  accessibility: {
    title: 'Accessibility',
    lead: 'AkwapUI targets WCAG 2.1 AA, with WCAG 2.2 AA considerations such as focus appearance and target size.',
    blocks: [
      { t: 'h2', id: 'built-in', text: 'Built into components' },
      {
        t: 'table',
        caption: 'Accessibility features',
        head: ['Requirement', 'How AkwapUI handles it'],
        rows: [
          ['Semantic HTML', 'Native buttons, inputs, tables, lists, `<nav>`, `<dialog>` roles and real headings.'],
          ['Keyboard', 'Every control works with Tab, Enter, Space, Esc and arrow keys following the ARIA Authoring Practices.'],
          ['Visible focus', '2px focus ring with an inner contrast ring on `:focus-visible`, in all themes.'],
          ['Labels', '`AkField` links labels, helper text and errors; icon-only buttons require a name.'],
          ['Errors', 'Messages say how to fix the problem, use `aria-invalid` and are announced politely; focus moves to the first error on submit.'],
          ['Dialogs', 'Focus trap, Esc to close, scroll lock and focus restoration.'],
          ['Status messages', 'Toasts, alerts and route changes are announced through live regions.'],
          ['Colour', 'Text meets 4.5:1; status uses icons and text, never colour alone.'],
          ['Motion', '`prefers-reduced-motion` and an in-app setting.'],
          ['High contrast', 'A dedicated theme, and `forced-colors` support for Windows contrast themes.'],
        ],
      },
      { t: 'h2', id: 'page', text: 'Page-level patterns' },
      { t: 'list', items: ['A skip link jumps to `#main` on every layout.', 'After client-side navigation, the new page title is announced and focus moves to the main region.', 'Each page has one H1 and a logical heading order.', 'Every page is checked with axe in the end-to-end tests.'] },
      { t: 'h2', id: 'checklist', text: 'Checklist for new screens' },
      { t: 'list', ordered: true, items: ['Can you complete every task with the keyboard alone?', 'Is focus always visible and in a logical order?', 'Do all images, icons and controls have text alternatives?', 'Does the screen work at 320px wide and at 200% zoom?', 'Does it still make sense in high contrast and with reduced motion?'] },
    ],
  },
  responsive: {
    title: 'Responsive design',
    lead: 'Every page is designed and tested at 320, 375, 425, 768, 1024, 1280, 1440 and 1920px.',
    blocks: [
      { t: 'h2', id: 'strategy', text: 'Strategy' },
      { t: 'list', items: ['Mobile first: base styles target phones; `sm:` to `3xl:` add complexity.', 'Navigation adapts: the dashboard sidebar is full from 1280px, an icon rail from 768px and a drawer below.', 'Tables hide low-priority columns and scroll inside their own region.', 'Dialogs become bottom sheets on phones; footers stack.', 'Touch targets are at least 24px with spacing, and 40–44px for primary actions on touch layouts.'] },
      { t: 'h2', id: 'no-overflow', text: 'No horizontal page scroll' },
      { t: 'p', text: 'The end-to-end suite loads every route at 320px and fails if the document is wider than the viewport.' },
      { t: 'links', items: [{ label: 'Grid system', to: '/docs/foundations/grid', description: 'Breakpoints and overflow techniques.' }, { label: 'Dashboard layouts', to: '/docs/patterns/dashboard-layouts', description: 'How the app shell adapts.' }] },
    ],
  },
}
