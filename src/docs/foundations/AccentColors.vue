<script setup lang="ts">
import { computed } from 'vue'
import { contrastRatio } from '@/utils/color'
import { ACCENT_COLORS, accentClasses } from '@/components/ui/accent'
import { resolveCssVar } from './resolveColor'
import { useTokenRefresh } from './useTokenRefresh'

/** Accent roles per hue, with live contrast in the current theme. */
const tick = useTokenRefresh()
const rows = computed(() => {
  void tick.value
  if (typeof document === 'undefined') return []
  const surface = resolveCssVar('--ak-color-surface')
  const onAccent = resolveCssVar('--ak-color-on-accent')
  return ACCENT_COLORS.map((h) => {
    const fg = resolveCssVar(`--ak-color-${h}`)
    const bg = resolveCssVar(`--ak-color-${h}-background`)
    const strong = resolveCssVar(`--ak-color-${h}-strong`)
    return {
      h,
      cls: accentClasses[h],
      onTint: contrastRatio(fg, bg),
      onSurface: contrastRatio(fg, surface),
      onStrong: contrastRatio(onAccent, strong),
    }
  })
})
const fmt = (n: number) => `${n.toFixed(1)}:1`
</script>

<template>
  <div class="overflow-x-auto rounded-card border border-line-subtle" role="region" tabindex="0" aria-label="Accent colour roles">
    <table class="w-full min-w-[640px] text-left text-body-1">
      <caption class="sr-only">Accent colour roles and contrast in the current theme</caption>
      <thead>
        <tr class="border-b border-line-subtle bg-surface-secondary">
          <th scope="col" class="px-3 py-2 text-caption-1-strong text-secondary">Hue</th>
          <th scope="col" class="px-3 py-2 text-caption-1-strong text-secondary">Tint</th>
          <th scope="col" class="px-3 py-2 text-caption-1-strong text-secondary">Strong</th>
          <th scope="col" class="px-3 py-2 text-caption-1-strong text-secondary">Text on surface</th>
          <th scope="col" class="px-3 py-2 text-caption-1-strong text-secondary">Contrast</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.h" class="border-b border-line-subtle last:border-0">
          <th scope="row" class="px-3 py-2 font-mono text-caption-1 font-normal text-primary">{{ r.h }}</th>
          <td class="px-3 py-2">
            <span class="inline-flex rounded-sm border px-2 py-0.5 text-caption-1-strong" :class="[r.cls.background, r.cls.text, r.cls.border]">bg-{{ r.h }}-background</span>
          </td>
          <td class="px-3 py-2">
            <span class="inline-flex rounded-sm px-2 py-0.5 text-caption-1-strong text-on-accent" :class="r.cls.strong">bg-{{ r.h }}-strong</span>
          </td>
          <td class="px-3 py-2 text-caption-1-strong" :class="r.cls.text">text-{{ r.h }}</td>
          <td class="px-3 py-2 text-caption-1 whitespace-nowrap text-secondary">
            {{ fmt(r.onTint) }} tint · {{ fmt(r.onSurface) }} surface · {{ fmt(r.onStrong) }} strong
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
