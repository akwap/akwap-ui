<script setup lang="ts">
import { slotVar, type Series } from './chartUtils'
/** Legend: coloured swatch beside text-token label (text never wears the series colour). */
defineProps<{ series: Series[]; shape?: 'line' | 'square' }>()
</script>

<template>
  <ul class="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption-1 text-secondary">
    <li v-for="(s, i) in series" :key="s.name" class="inline-flex items-center gap-1.5">
      <span
        aria-hidden="true"
        class="inline-block shrink-0"
        :class="shape === 'line' ? 'h-0.5 w-3 rounded-full' : 'size-2.5 rounded-sm'"
        :style="{ background: slotVar(s.slot ?? i + 1) }"
      />
      {{ s.name }}
    </li>
  </ul>
</template>
