<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { useElementSize } from '@/composables/useElementSize'
import { compactTick, niceTicks, slotVar, type Series } from './chartUtils'
import AkChartLegend from './AkChartLegend.vue'

/**
 * AkLineChart — change over time for 1–4 series. 2px lines, optional 10%
 * area wash, hairline grid, crosshair + tooltip on hover/focus, and a
 * visually hidden data table for screen readers.
 */
const props = withDefaults(
  defineProps<{
    labels: string[]
    series: Series[]
    height?: number
    /** Wash under the first (primary) series only. */
    area?: boolean
    /** Formats values in tooltip and table. */
    format?: (n: number) => string
    /** Accessible summary, e.g. "Revenue rose 12% over the year". */
    summary: string
  }>(),
  { height: 240, format: (n: number) => n.toLocaleString('en-US') },
)
const uid = useId()
const box = ref<HTMLElement | null>(null)
const { width } = useElementSize(box)
const hover = ref<number | null>(null)

const pad = { top: 12, right: 12, bottom: 28, left: 48 }
const innerW = computed(() => Math.max(10, width.value - pad.left - pad.right))
const innerH = computed(() => props.height - pad.top - pad.bottom)
const ticks = computed(() => niceTicks(Math.max(...props.series.flatMap((s) => s.values), 1)))
const yMax = computed(() => ticks.value[ticks.value.length - 1] || 1)
const x = (i: number) => pad.left + (props.labels.length <= 1 ? 0 : (i / (props.labels.length - 1)) * innerW.value)
const y = (v: number) => pad.top + innerH.value - (v / yMax.value) * innerH.value

const paths = computed(() =>
  props.series.map((s, si) => {
    const d = s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
    const area = `${d} L${x(s.values.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`
    return { d, area, color: slotVar(s.slot ?? si + 1), name: s.name, index: si }
  }),
)
const labelEvery = computed(() => Math.max(1, Math.ceil(props.labels.length / Math.max(2, Math.floor(innerW.value / 64)))))

function onMove(e: PointerEvent) {
  const rect = (e.currentTarget as SVGElement).getBoundingClientRect()
  const px = e.clientX - rect.left - pad.left
  const i = Math.round((px / innerW.value) * (props.labels.length - 1))
  hover.value = Math.max(0, Math.min(props.labels.length - 1, i))
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') hover.value = Math.min(props.labels.length - 1, (hover.value ?? -1) + 1)
  else if (e.key === 'ArrowLeft') hover.value = Math.max(0, (hover.value ?? props.labels.length) - 1)
  else if (e.key === 'Escape') hover.value = null
  else return
  e.preventDefault()
}
const tipLeft = computed(() => (hover.value === null ? 0 : x(hover.value)))
</script>

<template>
  <figure class="flex flex-col gap-3">
    <AkChartLegend v-if="series.length > 1" :series="series" shape="line" />
    <div ref="box" class="relative w-full" :style="{ height: `${height}px` }">
      <svg
        :width="width"
        :height="height"
        role="img"
        :aria-label="summary"
        :aria-describedby="`${uid}-table`"
        tabindex="0"
        class="block overflow-visible rounded-sm focus-ring"
        @pointermove="onMove"
        @pointerleave="hover = null"
        @keydown="onKey"
        @blur="hover = null"
      >
        <g aria-hidden="true">
          <g v-for="t in ticks" :key="t">
            <line :x1="pad.left" :x2="pad.left + innerW" :y1="y(t)" :y2="y(t)" stroke="var(--ak-color-chart-grid)" stroke-width="1" />
            <text :x="pad.left - 8" :y="y(t)" text-anchor="end" dominant-baseline="middle" class="fill-fg-tertiary text-caption-1">{{ compactTick(t) }}</text>
          </g>
          <template v-for="(l, i) in labels" :key="l">
            <text v-if="i % labelEvery === 0" :x="x(i)" :y="height - 8" text-anchor="middle" class="fill-fg-tertiary text-caption-1">{{ l }}</text>
          </template>
          <template v-for="p in paths" :key="p.name">
            <path v-if="area && p.index === 0" :d="p.area" :fill="p.color" fill-opacity="0.1" />
            <path :d="p.d" fill="none" :stroke="p.color" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
          </template>
          <g v-if="hover !== null">
            <line :x1="tipLeft" :x2="tipLeft" :y1="pad.top" :y2="pad.top + innerH" stroke="var(--ak-color-border-strong)" stroke-width="1" />
            <circle
              v-for="(s, si) in series"
              :key="s.name"
              :cx="tipLeft"
              :cy="y(s.values[hover] ?? 0)"
              r="4.5"
              :fill="slotVar(s.slot ?? si + 1)"
              stroke="var(--ak-color-surface)"
              stroke-width="2"
            />
          </g>
        </g>
      </svg>
      <div
        v-if="hover !== null"
        class="pointer-events-none absolute top-0 z-10 min-w-36 rounded-md border border-line-subtle bg-surface-overlay px-3 py-2 shadow-elevation-8"
        :style="{ left: `${Math.min(Math.max(tipLeft + 12, 0), width - 160)}px` }"
        aria-hidden="true"
      >
        <p class="mb-1 text-caption-1-strong text-primary">{{ labels[hover] }}</p>
        <p v-for="(s, si) in series" :key="s.name" class="flex items-center gap-2 text-caption-1 text-secondary">
          <span class="h-0.5 w-3 rounded-full" :style="{ background: slotVar(s.slot ?? si + 1) }" />
          <span class="flex-1">{{ s.name }}</span>
          <span class="font-semibold text-primary tabular-nums">{{ format(s.values[hover] ?? 0) }}</span>
        </p>
      </div>
    </div>
    <div class="sr-only">
    <table :id="`${uid}-table`">
      <caption>{{ summary }}</caption>
      <thead><tr><th scope="col">Period</th><th v-for="s in series" :key="s.name" scope="col">{{ s.name }}</th></tr></thead>
      <tbody>
        <tr v-for="(l, i) in labels" :key="l"><th scope="row">{{ l }}</th><td v-for="s in series" :key="s.name">{{ format(s.values[i] ?? 0) }}</td></tr>
      </tbody>
    </table>
    </div>
  </figure>
</template>
