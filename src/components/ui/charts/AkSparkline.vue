<script setup lang="ts">
import { computed } from 'vue'
/** AkSparkline — tiny decorative trend line; the parent supplies the text value. */
const props = withDefaults(defineProps<{ values: number[]; intent?: 'brand' | 'danger' | 'success' }>(), { intent: 'brand' })
const d = computed(() => {
  const min = Math.min(...props.values)
  const max = Math.max(...props.values)
  const span = max - min || 1
  return props.values.map((v, i) => `${i ? 'L' : 'M'}${((i / (props.values.length - 1)) * 100).toFixed(2)},${(36 - ((v - min) / span) * 32).toFixed(2)}`).join(' ')
})
const color = computed(() => ({ brand: 'var(--ak-color-brand-primary)', danger: 'var(--ak-color-danger-strong)', success: 'var(--ak-color-success-strong)' })[props.intent])
</script>

<template>
  <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
    <path :d="d" fill="none" :stroke="color" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round" />
  </svg>
</template>
