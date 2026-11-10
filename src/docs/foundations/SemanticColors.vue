<script setup lang="ts">
import { computed } from 'vue'
import { contrastRatio } from '@/utils/color'
import { resolveCssVar } from './resolveColor'
import { useTokenRefresh } from './useTokenRefresh'

/** Semantic roles with live values and WCAG contrast for the current theme. */
const tick = useTokenRefresh()
const groups: { title: string; rows: [token: string, utility: string, use: string][] }[] = [
  {
    title: 'Backgrounds and surfaces',
    rows: [
      ['background', 'bg-background', 'App canvas'],
      ['background-secondary', 'bg-background-secondary', 'Alternate page bands'],
      ['surface', 'bg-surface', 'Cards, panels, inputs'],
      ['surface-secondary', 'bg-surface-secondary', 'Filled cards, table headers'],
      ['surface-hover', 'bg-surface-hover', 'Hover on surfaces'],
      ['surface-selected', 'bg-surface-selected', 'Selected rows and items'],
      ['surface-overlay', 'bg-surface-overlay', 'Menus, dialogs, popovers'],
    ],
  },
  {
    title: 'Foreground',
    rows: [
      ['text-primary', 'text-primary', 'Body text and headings'],
      ['text-secondary', 'text-secondary', 'Supporting text'],
      ['text-tertiary', 'text-tertiary', 'Captions, placeholders'],
      ['text-disabled', 'text-disabled', 'Disabled labels (exempt from contrast)'],
      ['text-link', 'text-link', 'Links'],
      ['brand-foreground', 'text-brand', 'Brand-coloured text and icons'],
    ],
  },
  {
    title: 'Brand',
    rows: [
      ['brand-primary', 'bg-brand', 'Primary buttons, selection'],
      ['brand-hover', 'bg-brand-hover', 'Primary hover'],
      ['brand-subtle', 'bg-brand-subtle', 'Tinted brand backgrounds'],
      ['on-brand', 'text-on-brand', 'Text on brand fills'],
    ],
  },
  {
    title: 'Strokes',
    rows: [
      ['border', 'border-default', 'Control borders'],
      ['border-subtle', 'border-subtle', 'Card and divider strokes'],
      ['border-strong', 'border-strong', 'Emphasised strokes'],
      ['border-focus', 'outline-line-focus', 'Focus ring'],
    ],
  },
  {
    title: 'Status',
    rows: [
      ['success', 'text-success', 'Success text and icons'],
      ['warning', 'text-warning', 'Warning text and icons'],
      ['danger', 'text-danger', 'Error text and icons'],
      ['info', 'text-info', 'Informational text and icons'],
      ['danger-background', 'bg-danger-background', 'Error message bars'],
    ],
  },
]
const textTokens = ['text-primary', 'text-secondary', 'text-tertiary', 'text-link', 'brand-foreground', 'success', 'warning', 'danger', 'info']
const values = computed(() => {
  void tick.value
  if (typeof document === 'undefined') return {} as Record<string, string>
  const out: Record<string, string> = {}
  for (const g of groups) for (const [t] of g.rows) out[t] = resolveCssVar(`--ak-color-${t}`)
  out.surface = resolveCssVar('--ak-color-surface')
  out['on-brand-bg'] = resolveCssVar('--ak-color-brand-primary')
  return out
})
function ratio(token: string) {
  const v = values.value
  if (!v[token]) return null
  if (token === 'on-brand') return contrastRatio(v[token]!, v['on-brand-bg']!)
  if (!textTokens.includes(token)) return null
  return contrastRatio(v[token]!, v.surface!)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div v-for="g in groups" :key="g.title" class="overflow-x-auto rounded-card border border-line-subtle" role="region" tabindex="0" :aria-label="g.title">
      <table class="w-full min-w-[560px] text-left text-body-1">
        <caption class="border-b border-line-subtle bg-surface-secondary px-4 py-2 text-left text-body-1-strong text-primary">{{ g.title }}</caption>
        <thead>
          <tr class="border-b border-line-subtle">
            <th scope="col" class="px-4 py-2 text-caption-1-strong text-secondary">Token</th>
            <th scope="col" class="px-4 py-2 text-caption-1-strong text-secondary">Utility</th>
            <th scope="col" class="px-4 py-2 text-caption-1-strong text-secondary">Value</th>
            <th scope="col" class="px-4 py-2 text-caption-1-strong text-secondary">Contrast</th>
            <th scope="col" class="px-4 py-2 text-caption-1-strong text-secondary">Use</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="[t, u, use] in g.rows" :key="t" class="border-b border-line-subtle last:border-0">
            <td class="px-4 py-2">
              <span class="flex items-center gap-2">
                <span class="size-5 shrink-0 rounded-sm border border-line" :style="{ background: `var(--ak-color-${t})` }" aria-hidden="true" />
                <code class="font-mono text-caption-1 text-primary">--ak-color-{{ t }}</code>
              </span>
            </td>
            <td class="px-4 py-2"><code class="font-mono text-caption-1 text-brand">{{ u }}</code></td>
            <td class="px-4 py-2 font-mono text-caption-1 text-tertiary">{{ values[t] }}</td>
            <td class="px-4 py-2 text-caption-1">
              <template v-if="ratio(t)">
                <span :class="t === 'text-disabled' ? 'text-tertiary' : ratio(t)! >= 4.5 ? 'text-success' : ratio(t)! >= 3 ? 'text-warning' : 'text-danger'">
                  {{ ratio(t)!.toFixed(2) }}:1
                  {{ t === 'text-disabled' ? '' : ratio(t)! >= 4.5 ? 'AA' : ratio(t)! >= 3 ? 'AA large' : 'Fail' }}
                </span>
              </template>
              <span v-else class="text-tertiary">—</span>
            </td>
            <td class="px-4 py-2 text-secondary">{{ use }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-caption-1 text-tertiary">Contrast is measured live against <code>--ak-color-surface</code> (and against the brand fill for on-brand) in the current theme. Switch theme to recheck.</p>
  </div>
</template>
