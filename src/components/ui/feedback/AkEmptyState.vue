<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Inbox, CircleAlert, CircleCheck, SearchX, Lock } from '@lucide/vue'

/**
 * AkEmptyState — explains why a region has no content and what to do next.
 * Variants cover empty, no results, error, success/confirmation and no access.
 */
const props = withDefaults(
  defineProps<{
    variant?: 'empty' | 'search' | 'error' | 'success' | 'forbidden'
    title: string
    description?: string
    icon?: Component
    size?: 'sm' | 'md' | 'lg'
    headingLevel?: 1 | 2 | 3 | 4
  }>(),
  { variant: 'empty', size: 'md', headingLevel: 3 },
)
const tone = computed(
  () =>
    ({
      empty: { icon: Inbox, cls: 'bg-surface-tertiary text-secondary' },
      search: { icon: SearchX, cls: 'bg-surface-tertiary text-secondary' },
      error: { icon: CircleAlert, cls: 'bg-danger-background text-danger' },
      success: { icon: CircleCheck, cls: 'bg-success-background text-success' },
      forbidden: { icon: Lock, cls: 'bg-warning-background text-warning' },
    })[props.variant],
)
</script>

<template>
  <div
    class="mx-auto flex max-w-md flex-col items-center text-center"
    :class="{ sm: 'gap-2 py-6', md: 'gap-3 py-10', lg: 'gap-4 py-16' }[size]"
    :role="variant === 'error' ? 'alert' : variant === 'success' ? 'status' : undefined"
  >
    <span class="flex items-center justify-center rounded-full" :class="[tone.cls, size === 'sm' ? 'size-10' : 'size-14']">
      <component :is="icon ?? tone.icon" :class="size === 'sm' ? 'size-5' : 'size-7'" aria-hidden="true" />
    </span>
    <component :is="`h${headingLevel}`" class="text-primary" :class="size === 'lg' ? 'text-title-3' : 'text-subtitle-2'">{{ title }}</component>
    <p v-if="description" class="text-body-1 text-secondary">{{ description }}</p>
    <div v-if="$slots.default" class="mt-2 flex flex-wrap justify-center gap-2"><slot /></div>
  </div>
</template>
