<script setup lang="ts">
import { computed, type Component } from 'vue'

export type BadgeColor = 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'

/**
 * AkBadge — compact label for status, category or counts.
 * Use sparingly; pair colour with text (or an icon) so meaning never relies
 * on colour alone.
 */
const props = withDefaults(
  defineProps<{
    color?: BadgeColor
    appearance?: 'filled' | 'tint' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    icon?: Component
    /** Small dot before the label. */
    dot?: boolean
    shape?: 'rounded' | 'circular'
  }>(),
  { color: 'neutral', appearance: 'tint', size: 'md', shape: 'circular' },
)
const map: Record<BadgeColor, { filled: string; tint: string; outline: string; dot: string }> = {
  brand: { filled: 'bg-brand text-on-brand', tint: 'bg-brand-subtle text-brand border-brand-secondary', outline: 'text-brand border-brand-stroke', dot: 'bg-brand' },
  neutral: { filled: 'bg-surface-inverse text-inverse', tint: 'bg-surface-selected text-secondary border-line-subtle', outline: 'text-secondary border-line', dot: 'bg-fg-tertiary' },
  success: { filled: 'bg-success-strong text-on-brand', tint: 'bg-success-background text-success border-success-border', outline: 'text-success border-success-border', dot: 'bg-success-strong' },
  warning: { filled: 'bg-warning-strong text-on-brand', tint: 'bg-warning-background text-warning border-warning-border', outline: 'text-warning border-warning-border', dot: 'bg-warning-strong' },
  danger: { filled: 'bg-danger-strong text-on-brand', tint: 'bg-danger-background text-danger border-danger-border', outline: 'text-danger border-danger-border', dot: 'bg-danger-strong' },
  info: { filled: 'bg-info-strong text-on-brand', tint: 'bg-info-background text-info border-info-border', outline: 'text-info border-info-border', dot: 'bg-info-strong' },
}
const cls = computed(() => [
  'inline-flex max-w-full items-center gap-1 whitespace-nowrap border font-semibold',
  props.appearance === 'filled' ? 'border-transparent' : '',
  props.appearance === 'outline' ? 'bg-transparent' : '',
  map[props.color][props.appearance],
  { sm: 'h-4 px-1.5 text-caption-2 [&_svg]:size-2.5', md: 'h-5 px-2 text-caption-1 [&_svg]:size-3', lg: 'h-6 px-2.5 text-body-1 [&_svg]:size-3.5' }[props.size],
  props.shape === 'circular' ? 'rounded-full' : 'rounded-sm',
])
</script>

<template>
  <span :class="cls">
    <span v-if="dot" class="size-1.5 shrink-0 rounded-full" :class="map[color].dot" aria-hidden="true" />
    <component :is="icon" v-if="icon" class="shrink-0" aria-hidden="true" />
    <span class="truncate"><slot /></span>
  </span>
</template>
