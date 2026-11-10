<script setup lang="ts">
import { computed, type Component } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import AkSpinner from '../feedback/AkSpinner.vue'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent' | 'danger' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * AkButton — the single button primitive. Renders <button>, <a> or
 * <RouterLink> depending on `href` / `to`.
 */
const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    /** Text announced while loading (defaults to the button text). */
    loadingText?: string
    icon?: Component
    iconPosition?: 'start' | 'end'
    /** Square button that shows only the icon. Requires `aria-label`. */
    iconOnly?: boolean
    block?: boolean
    href?: string
    to?: RouteLocationRaw
    /** Visual pressed state for toggle buttons; sets aria-pressed. */
    pressed?: boolean
  }>(),
  { variant: 'secondary', size: 'md', type: 'button', iconPosition: 'start', pressed: undefined },
)

const isInactive = computed(() => props.disabled || props.loading)

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-control-sm min-w-16 px-2 gap-1 text-caption-1 font-semibold [&_svg]:size-4',
  md: 'h-control-md min-w-20 px-3 gap-1.5 text-body-1-strong [&_svg]:size-5',
  lg: 'h-control-lg min-w-24 px-4 gap-2 text-body-2 font-semibold [&_svg]:size-5',
}
const iconOnlySizes: Record<ButtonSize, string> = {
  sm: 'size-control-sm [&_svg]:size-4',
  md: 'size-control-md [&_svg]:size-5',
  lg: 'size-control-lg [&_svg]:size-6',
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-on-brand border-transparent enabled:hover:bg-brand-hover enabled:active:bg-brand-pressed [&:is(a):hover]:bg-brand-hover',
  secondary:
    'bg-surface text-primary border-line enabled:hover:bg-surface-hover enabled:hover:border-line-hover enabled:active:bg-surface-pressed [&:is(a):hover]:bg-surface-hover',
  outline:
    'bg-transparent text-brand border-brand-stroke enabled:hover:bg-brand-subtle enabled:active:bg-brand-subtle-hover [&:is(a):hover]:bg-brand-subtle',
  subtle:
    'bg-transparent text-primary border-transparent enabled:hover:bg-subtle-hover enabled:active:bg-subtle-pressed [&:is(a):hover]:bg-subtle-hover',
  transparent:
    'bg-transparent text-secondary border-transparent enabled:hover:text-brand enabled:active:opacity-80 [&:is(a):hover]:text-brand',
  danger:
    'bg-danger-strong text-on-brand border-transparent enabled:hover:bg-danger-hover enabled:active:bg-danger-pressed [&:is(a):hover]:bg-danger-hover',
  link: 'bg-transparent text-link border-transparent !h-auto !min-w-0 !px-0 underline-offset-2 enabled:hover:underline enabled:hover:text-link-hover [&:is(a):hover]:underline',
}

const classes = computed(() => [
  'relative inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none rounded-control border',
  'transition-[background-color,border-color,color,opacity] duration-faster ease-standard focus-ring',
  props.iconOnly ? iconOnlySizes[props.size] : sizeClasses[props.size],
  isInactive.value && props.variant !== 'link'
    ? props.loading
      ? variantClasses[props.variant] + ' cursor-progress opacity-90'
      : 'bg-control-disabled text-disabled border-line-disabled cursor-not-allowed'
    : variantClasses[props.variant],
  props.disabled && props.variant === 'link' ? 'text-disabled cursor-not-allowed' : '',
  props.pressed ? 'bg-surface-selected border-line-strong' : '',
  props.block ? 'w-full' : '',
])
</script>

<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :href="tag === 'a' && !disabled ? href : undefined"
    :to="to"
    :disabled="tag === 'button' ? disabled : undefined"
    :aria-disabled="(tag !== 'button' && disabled) || loading ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :aria-pressed="pressed === undefined ? undefined : String(pressed)"
    :tabindex="tag !== 'button' && disabled ? -1 : undefined"
    :class="classes"
    @click="(e: MouseEvent) => { if (isInactive) { e.preventDefault(); e.stopImmediatePropagation() } }"
  >
    <AkSpinner v-if="loading" :size="size === 'lg' ? 'sm' : 'xs'" appearance="current" decorative class="shrink-0" />
    <component :is="icon" v-else-if="icon && iconPosition === 'start'" aria-hidden="true" class="shrink-0" />
    <span v-if="!iconOnly && ($slots.default || loadingText)" class="truncate">
      <template v-if="loading && loadingText">{{ loadingText }}</template>
      <slot v-else />
    </span>
    <span v-else-if="iconOnly" class="sr-only"><slot /></span>
    <component :is="icon" v-if="icon && iconPosition === 'end' && !loading" aria-hidden="true" class="shrink-0" />
    <slot name="end" />
  </component>
</template>
