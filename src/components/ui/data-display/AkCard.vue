<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

/**
 * AkCard — groups related content. Borders do the separating; elevation is
 * reserved for cards that are interactive or float above content.
 * Header: `title`/`subtitle` props or #header slot; #actions sits top-right.
 */
const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    appearance?: 'outline' | 'filled' | 'subtle' | 'elevated'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    /** Makes the whole card a link (keep inner content non-interactive). */
    to?: RouteLocationRaw
    href?: string
    selected?: boolean
    headingLevel?: 2 | 3 | 4
  }>(),
  { appearance: 'outline', padding: 'md', headingLevel: 3 },
)
const interactive = computed(() => !!props.to || !!props.href)
const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'section'))
const pad = computed(() => ({ none: '', sm: 'p-3', md: 'p-4 sm:p-card', lg: 'p-6 sm:p-8' })[props.padding])
const look = computed(
  () =>
    ({
      outline: 'bg-surface border border-line-subtle',
      filled: 'bg-surface-secondary border border-transparent',
      subtle: 'bg-transparent border border-transparent',
      elevated: 'bg-surface border border-transparent shadow-elevation-4 hc:border-line',
    })[props.appearance],
)
</script>

<template>
  <component
    :is="tag"
    v-bind="to ? { to } : href ? { href } : {}"
    class="flex min-w-0 flex-col rounded-card text-left"
    :class="[
      look,
      pad,
      interactive && 'transition-[box-shadow,border-color] duration-fast ease-standard hover:border-line hover:shadow-elevation-8 focus-ring',
      selected && 'ring-2 ring-brand-stroke',
    ]"
  >
    <header v-if="title || $slots.header || $slots.actions" class="mb-4 flex items-start gap-3">
      <div class="min-w-0 flex-1">
        <slot name="header">
          <component :is="`h${headingLevel}`" class="text-subtitle-2 text-primary">{{ title }}</component>
          <p v-if="subtitle" class="mt-0.5 text-caption-1 text-tertiary">{{ subtitle }}</p>
        </slot>
      </div>
      <div v-if="$slots.actions" class="-my-1 flex shrink-0 items-center gap-1"><slot name="actions" /></div>
    </header>
    <div class="min-w-0 flex-1"><slot /></div>
    <footer v-if="$slots.footer" class="mt-4 flex items-center gap-2 border-t border-line-subtle pt-3"><slot name="footer" /></footer>
  </component>
</template>
