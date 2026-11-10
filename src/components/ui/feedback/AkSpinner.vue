<script setup lang="ts">
import { computed } from 'vue'

/**
 * AkSpinner — indeterminate loading indicator.
 * Pair with visible text, or provide `label` so screen readers announce it.
 */
const props = withDefaults(
  defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    appearance?: 'primary' | 'inverted' | 'current'
    label?: string
    labelPosition?: 'after' | 'below'
    /** Hide from assistive tech (when the parent already conveys busy state). */
    decorative?: boolean
  }>(),
  { size: 'md', appearance: 'primary', labelPosition: 'after' },
)

const sizeClass = computed(
  () =>
    ({
      xs: 'size-3 border-[1.5px]',
      sm: 'size-4 border-2',
      md: 'size-6 border-2',
      lg: 'size-8 border-[3px]',
      xl: 'size-12 border-4',
    })[props.size],
)
const colorClass = computed(
  () =>
    ({
      primary: 'border-brand-secondary border-t-brand',
      inverted: 'border-on-brand/30 border-t-on-brand',
      current: 'border-current/25 border-t-current',
    })[props.appearance],
)
</script>

<template>
  <span
    :role="decorative ? undefined : 'status'"
    :aria-hidden="decorative ? 'true' : undefined"
    :aria-label="label || decorative ? undefined : 'Loading'"
    class="inline-flex items-center gap-2"
    :class="labelPosition === 'below' ? 'flex-col' : ''"
  >
    <span aria-hidden="true" class="inline-block shrink-0 animate-spin-ak rounded-full" :class="[sizeClass, colorClass]" />
    <span v-if="label" class="text-body-1 text-secondary">{{ label }}</span>
  </span>
</template>
