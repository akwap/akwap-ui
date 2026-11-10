<script setup lang="ts">
import { computed, ref } from 'vue'
import { slotVar } from './chartUtils'

/**
 * AkDonutChart — part-to-whole for ≤ 5 parts. The legend lists every value
 * and percentage, so identity and magnitude never rely on colour.
 */
const props = withDefaults(
  defineProps<{ items: { label: string; value: number; slot?: number }[]; size?: number; summary: string; centerLabel?: string; format?: (n: number) => string; showPercent?: boolean }>(),
  { size: 160, showPercent: true, format: (n: number) => n.toLocaleString('en-US') },
)
const hover = ref<number | null>(null)
const total = computed(() => props.items.reduce((a, b) => a + b.value, 0) || 1)
const r = computed(() => props.size / 2 - 10)
const C = computed(() => 2 * Math.PI * r.value)
const arcs = computed(() => {
  let acc = 0
  const gap = 2
  return props.items.map((it, i) => {
    const len = (it.value / total.value) * C.value
    const arc = { len: Math.max(0, len - gap), offset: -acc, color: slotVar(it.slot ?? i + 1), i }
    acc += len
    return arc
  })
})
</script>

<template>
  <figure class="flex flex-col items-center gap-5">
    <div class="relative shrink-0" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" role="img" :aria-label="summary" class="-rotate-90">
        <circle
          v-for="a in arcs"
          :key="a.i"
          :cx="size / 2"
          :cy="size / 2"
          :r="r"
          fill="none"
          :stroke="a.color"
          :stroke-width="hover === a.i ? 18 : 14"
          :stroke-dasharray="`${a.len} ${C - a.len}`"
          :stroke-dashoffset="a.offset"
          class="transition-[stroke-width] duration-fast"
          @pointerenter="hover = a.i"
          @pointerleave="hover = null"
        />
      </svg>
      <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center" aria-hidden="true">
        <span class="text-subtitle-1 text-primary tabular-nums">{{ hover !== null ? Math.round((items[hover]!.value / total) * 100) + '%' : format(total) }}</span>
        <span class="max-w-[70%] truncate text-caption-1 text-tertiary">{{ hover !== null ? items[hover]!.label : centerLabel }}</span>
      </div>
    </div>
    <ul class="flex w-full min-w-0 flex-col gap-2">
      <li v-for="(it, i) in items" :key="it.label" class="flex items-center gap-2 text-body-1" @pointerenter="hover = i" @pointerleave="hover = null">
        <span class="size-2.5 shrink-0 rounded-sm" :style="{ background: slotVar(it.slot ?? i + 1) }" aria-hidden="true" />
        <span class="min-w-0 flex-1 truncate text-secondary">{{ it.label }}</span>
        <span class="font-semibold text-primary tabular-nums">{{ format(it.value) }}</span>
        <span v-if="showPercent" class="w-10 text-right text-caption-1 text-tertiary tabular-nums">{{ Math.round((it.value / total) * 100) }}%</span>
      </li>
    </ul>
  </figure>
</template>
