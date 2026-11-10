<script setup lang="ts">
import { computed, useId } from 'vue'

/** AkProgressBar — determinate or indeterminate linear progress. */
const props = withDefaults(
  defineProps<{
    value?: number
    max?: number
    label?: string
    /** Show "45%" (or valueText) next to the label. */
    showValue?: boolean
    valueText?: string
    intent?: 'brand' | 'success' | 'warning' | 'danger'
    thickness?: 'thin' | 'medium' | 'large'
    helper?: string
  }>(),
  { max: 100, intent: 'brand', thickness: 'medium' },
)
const uid = useId()
const indeterminate = computed(() => props.value === undefined)
const pct = computed(() => (indeterminate.value ? 0 : Math.round((Math.min(props.value!, props.max) / props.max) * 100)))
const fill = computed(() => ({ brand: 'bg-brand', success: 'bg-success-strong', warning: 'bg-warning-strong', danger: 'bg-danger-strong' })[props.intent])
</script>

<template>
  <div class="flex flex-col gap-1">
    <div v-if="label || showValue" class="flex items-baseline justify-between gap-2 text-body-1">
      <span :id="`${uid}-label`" class="text-primary">{{ label }}</span>
      <span v-if="showValue && !indeterminate" class="text-caption-1 text-secondary tabular-nums">{{ valueText ?? `${pct}%` }}</span>
    </div>
    <div
      role="progressbar"
      :aria-labelledby="label ? `${uid}-label` : undefined"
      :aria-label="label ? undefined : 'Progress'"
      :aria-valuenow="indeterminate ? undefined : value"
      :aria-valuemin="0"
      :aria-valuemax="max"
      :aria-valuetext="valueText"
      class="relative w-full overflow-hidden rounded-full bg-surface-selected hc:border hc:border-line"
      :class="{ thin: 'h-0.5', medium: 'h-1', large: 'h-2' }[thickness]"
    >
      <div v-if="indeterminate" class="absolute inset-y-0 w-1/3 animate-indeterminate rounded-full" :class="fill" />
      <div v-else class="h-full rounded-full transition-[width] duration-slow ease-decelerate" :class="fill" :style="{ width: `${pct}%` }" />
    </div>
    <p v-if="helper" class="text-caption-1 text-tertiary">{{ helper }}</p>
  </div>
</template>
