<script setup lang="ts">
import { computed } from 'vue'
import { resolveCssVar } from './resolveColor'
import { useTokenRefresh } from './useTokenRefresh'
import { ACCENT_COLORS } from '@/components/ui/accent'

/** Global palettes: generated brand ramp, neutrals, status, accent and data colours. */
const tick = useTokenRefresh()
const brandSteps = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160]
const greys = [4, 10, 16, 22, 30, 38, 52, 68, 82, 90, 94, 98]
const status = ['green', 'amber', 'red', 'cyan']
const accents = ACCENT_COLORS
const statusSteps = [10, 20, 30, 40, 50, 60, 70, 80]
const hex = computed(() => {
  void tick.value
  if (typeof document === 'undefined') return {} as Record<string, string>
  const out: Record<string, string> = {}
  for (const s of brandSteps) out[`--ak-brand-${s}`] = resolveCssVar(`--ak-brand-${s}`)
  return out
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <section aria-labelledby="pal-brand">
      <h3 id="pal-brand" class="mb-1 text-subtitle-2 text-primary">Brand ramp</h3>
      <p class="mb-3 text-caption-1 text-secondary">Generated in OKLCH from <code>--ak-brand-hue</code> and <code>--ak-brand-chroma</code>. Change the brand colour in the playground or system settings and this ramp updates.</p>
      <ul class="grid grid-cols-4 gap-1 sm:grid-cols-8 lg:grid-cols-16">
        <li v-for="s in brandSteps" :key="s" class="min-w-0">
          <span class="block h-12 rounded-sm border border-line-subtle" :style="{ background: `var(--ak-brand-${s})` }" aria-hidden="true" />
          <span class="mt-1 block text-caption-1-strong text-primary">{{ s }}</span>
          <span class="block truncate font-mono text-caption-2 text-tertiary">{{ hex[`--ak-brand-${s}`] }}</span>
        </li>
      </ul>
    </section>
    <section aria-labelledby="pal-grey">
      <h3 id="pal-grey" class="mb-3 text-subtitle-2 text-primary">Neutrals</h3>
      <ul class="grid grid-cols-4 gap-1 sm:grid-cols-6 lg:grid-cols-12">
        <li v-for="g in greys" :key="g">
          <span class="block h-10 rounded-sm border border-line-subtle" :style="{ background: `var(--ak-grey-${g})` }" aria-hidden="true" />
          <span class="mt-1 block font-mono text-caption-2 text-tertiary">grey-{{ g }}</span>
        </li>
      </ul>
    </section>
    <section aria-labelledby="pal-status">
      <h3 id="pal-status" class="mb-3 text-subtitle-2 text-primary">Status ramps</h3>
      <div class="flex flex-col gap-2">
        <div v-for="c in status" :key="c" class="flex items-center gap-2">
          <span class="w-12 text-caption-1 text-secondary">{{ c }}</span>
          <ul class="grid flex-1 grid-cols-8 gap-1">
            <li v-for="s in statusSteps" :key="s" class="h-8 rounded-sm border border-line-subtle" :style="{ background: `var(--ak-${c}-${s})` }" :title="`--ak-${c}-${s}`"><span class="sr-only">{{ c }} {{ s }}</span></li>
          </ul>
        </div>
      </div>
    </section>
    <section aria-labelledby="pal-accent">
      <h3 id="pal-accent" class="mb-1 text-subtitle-2 text-primary">Accent ramps</h3>
      <p class="mb-3 text-caption-1 text-secondary">Twelve hues generated in OKLCH with the same lightness at each step, so every hue carries the same visual weight. Tokens: <code>--ak-palette-&lt;hue&gt;-10</code> to <code>-80</code>.</p>
      <div class="flex flex-col gap-2">
        <div v-for="c in accents" :key="c" class="flex items-center gap-2">
          <span class="w-16 shrink-0 text-caption-1 text-secondary">{{ c }}</span>
          <ul class="grid flex-1 grid-cols-8 gap-1">
            <li v-for="s in statusSteps" :key="s" class="h-8 rounded-sm border border-line-subtle" :style="{ background: `var(--ak-palette-${c}-${s})` }" :title="`--ak-palette-${c}-${s}`"><span class="sr-only">{{ c }} {{ s }}</span></li>
          </ul>
        </div>
      </div>
    </section>
    <section aria-labelledby="pal-data">
      <h3 id="pal-data" class="mb-1 text-subtitle-2 text-primary">Data visualisation</h3>
      <p class="mb-3 text-caption-1 text-secondary">Six categorical slots, checked for colour-vision deficiency, with separate dark-mode steps. Not tied to the brand hue.</p>
      <ul class="grid grid-cols-3 gap-2 sm:grid-cols-6">
        <li v-for="n in 6" :key="n">
          <span class="block h-10 rounded-sm" :style="{ background: `var(--ak-color-data-${n})` }" aria-hidden="true" />
          <span class="mt-1 block font-mono text-caption-2 text-tertiary">data-{{ n }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
