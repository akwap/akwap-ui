<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { useElementSize } from '@/composables/useElementSize'
import { compactTick, niceTicks, slotVar, type Series } from './chartUtils'
import AkChartLegend from './AkChartLegend.vue'

/**
 * AkBarChart — compare magnitudes across categories (grouped columns).
 * Bars ≤ 24px, 4px rounded data-end, square at the baseline, 2px surface
 * gap between touching bars, per-bar tooltip on hover/focus.
 */
const props = withDefaults(
  defineProps<{
    labels: string[]
    series: Series[]
    height?: number
    format?: (n: number) => string
    summary: string
  }>(),
  { height: 240, format: (n: number) => n.toLocaleString('en-US') },
)
const uid = useId()
const box = ref<HTMLElement | null>(null)
const { width } = useElementSize(box)
const hover = ref<{ g: number; s: number } | null>(null)

const pad = { top: 12, right: 8, bottom: 28, left: 48 }
const innerW = computed(() => Math.max(10, width.value - pad.left - pad.right))
const innerH = computed(() => props.height - pad.top - pad.bottom)
const ticks = computed(() => niceTicks(Math.max(...props.series.flatMap((s) => s.values), 1)))
const yMax = computed(() => ticks.value[ticks.value.length - 1] || 1)
const band = computed(() => innerW.value / props.labels.length)
const barW = computed(() => Math.min(24, (band.value * 0.7 - (props.series.length - 1) * 2) / props.series.length))
const groupW = computed(() => barW.value * props.series.length + (props.series.length - 1) * 2)
const y = (v: number) => pad.top + innerH.value - (v / yMax.value) * innerH.value

function barPath(xp: number, v: number, w: number) {
  const top = y(v)
  const base = y(0)
  const r = Math.min(4, w / 2, base - top)
  return `M${xp},${base} L${xp},${top + r} Q${xp},${top} ${xp + r},${top} L${xp + w - r},${top} Q${xp + w},${top} ${xp + w},${top + r} L${xp + w},${base} Z`
}
const bars = computed(() =>
  props.labels.flatMap((_, g) =>
    props.series.map((s, si) => {
      const xp = pad.left + g * band.value + (band.value - groupW.value) / 2 + si * (barW.value + 2)
      return { g, s: si, x: xp, d: barPath(xp, s.values[g] ?? 0, barW.value), color: slotVar(s.slot ?? si + 1), value: s.values[g] ?? 0 }
    }),
  ),
)
const labelEvery = computed(() => Math.max(1, Math.ceil(props.labels.length / Math.max(2, Math.floor(innerW.value / 48)))))
const hb = computed(() => (hover.value ? bars.value.find((b) => b.g === hover.value!.g && b.s === hover.value!.s) : null))
</script>

<template>
  <figure class="flex flex-col gap-3">
    <AkChartLegend v-if="series.length > 1" :series="series" />
    <div ref="box" class="relative w-full" :style="{ height: `${height}px` }">
      <svg :width="width" :height="height" role="img" :aria-label="summary" :aria-describedby="`${uid}-table`" class="block overflow-visible">
        <g aria-hidden="true">
          <g v-for="t in ticks" :key="t">
            <line :x1="pad.left" :x2="pad.left + innerW" :y1="y(t)" :y2="y(t)" stroke="var(--ak-color-chart-grid)" stroke-width="1" />
            <text :x="pad.left - 8" :y="y(t)" text-anchor="end" dominant-baseline="middle" class="fill-fg-tertiary text-caption-1">{{ compactTick(t) }}</text>
          </g>
          <template v-for="(l, g) in labels" :key="l">
            <text v-if="g % labelEvery === 0" :x="pad.left + g * band + band / 2" :y="height - 8" text-anchor="middle" class="fill-fg-tertiary text-caption-1">{{ l }}</text>
          </template>
        </g>
        <path
          v-for="b in bars"
          :key="`${b.g}-${b.s}`"
          :d="b.d"
          :fill="b.color"
          :opacity="hover && (hover.g !== b.g || hover.s !== b.s) ? 0.55 : 1"
          class="transition-opacity duration-faster"
          aria-hidden="true"
          @pointerenter="hover = { g: b.g, s: b.s }"
          @pointerleave="hover = null"
        />
      </svg>
      <div
        v-if="hb"
        class="pointer-events-none absolute z-10 rounded-md border border-line-subtle bg-surface-overlay px-3 py-2 shadow-elevation-8"
        :style="{ left: `${Math.min(Math.max(hb.x - 40, 0), width - 150)}px`, top: `${Math.max(0, y(hb.value) - 60)}px` }"
        aria-hidden="true"
      >
        <p class="text-caption-1-strong text-primary">{{ labels[hb.g] }}</p>
        <p class="flex items-center gap-2 text-caption-1 text-secondary">
          <span class="size-2 rounded-sm" :style="{ background: hb.color }" />{{ series[hb.s]?.name }}
          <span class="font-semibold text-primary tabular-nums">{{ format(hb.value) }}</span>
        </p>
      </div>
    </div>
    <div class="sr-only">
    <table :id="`${uid}-table`">
      <caption>{{ summary }}</caption>
      <thead><tr><th scope="col">Category</th><th v-for="s in series" :key="s.name" scope="col">{{ s.name }}</th></tr></thead>
      <tbody>
        <tr v-for="(l, i) in labels" :key="l"><th scope="row">{{ l }}</th><td v-for="s in series" :key="s.name">{{ format(s.values[i] ?? 0) }}</td></tr>
      </tbody>
    </table>
    </div>
  </figure>
</template>
