<script setup lang="ts">
import { computed, type Component } from 'vue'
import { isAccentColor, accentClasses, type AccentColor } from '../accent'
import { icons, type IconName } from './icons'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type IconColor = 'current' | 'primary' | 'secondary' | 'tertiary' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | AccentColor

/**
 * AkIcon — renders an icon at a token size and colour.
 *
 * Pass a semantic `name` from the AkwapUI icon set (`name="delete"`), or any
 * Lucide component with `icon`. Icons are decorative (hidden from assistive
 * technology) unless you give them a `label`, which makes them `role="img"`.
 */
const props = withDefaults(
  defineProps<{
    /** Semantic name from the AkwapUI icon set. */
    name?: IconName
    /** Any icon component (for example from `@lucide/vue`). Wins over `name`. */
    icon?: Component
    size?: IconSize | number
    color?: IconColor
    /** Accessible name. Without it the icon is decorative. */
    label?: string
    /** Stroke width; defaults to the system weight of 1.75. */
    strokeWidth?: number
  }>(),
  { size: 'md', color: 'current', strokeWidth: 1.75 },
)

const SIZES: Record<IconSize, number> = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32, '2xl': 48 }
const px = computed(() => (typeof props.size === 'number' ? props.size : SIZES[props.size]))
const component = computed(() => props.icon ?? (props.name ? icons[props.name] : undefined))

const COLORS: Record<Exclude<IconColor, AccentColor>, string> = {
  current: '',
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
  brand: 'text-brand-foreground',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
}
const colorCls = computed(() => (isAccentColor(props.color) ? accentClasses[props.color].text : COLORS[props.color]))

if (import.meta.env.DEV && !props.icon && !props.name) console.warn('[AkIcon] pass either `name` or `icon`.')
</script>

<template>
  <component
    :is="component"
    v-if="component"
    :size="px"
    :stroke-width="strokeWidth"
    class="inline-block shrink-0"
    :class="colorCls"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
  />
</template>
