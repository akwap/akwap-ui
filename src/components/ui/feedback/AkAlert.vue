<script setup lang="ts">
import { computed, type Component } from 'vue'
import { X } from '@lucide/vue'
import { intentClasses, intentIcon, intentLabel, type Intent } from './intent'

/**
 * AkAlert — inline message bar for page- or section-level status.
 * role="alert" for errors/warnings (announced immediately), role="status"
 * for info/success (announced politely).
 */
const props = withDefaults(
  defineProps<{
    intent?: Intent
    title?: string
    dismissible?: boolean
    icon?: Component
    /** "multiline" stacks the body under the title. */
    layout?: 'inline' | 'multiline'
    /** Override live-region role (e.g. 'none' for static content). */
    role?: 'alert' | 'status' | 'none'
  }>(),
  { intent: 'info', layout: 'multiline' },
)
defineEmits<{ dismiss: [] }>()
const cls = computed(() => intentClasses[props.intent])
const ariaRole = computed(() => props.role ?? (props.intent === 'danger' || props.intent === 'warning' ? 'alert' : 'status'))
</script>

<template>
  <div
    :role="ariaRole === 'none' ? undefined : ariaRole"
    class="flex gap-3 rounded-md border px-3 py-2.5 text-body-1"
    :class="[cls.surface, layout === 'inline' ? 'items-center' : 'items-start']"
  >
    <component :is="icon ?? intentIcon[intent]" class="size-5 shrink-0" :class="[cls.icon, layout === 'multiline' && 'mt-px']" aria-hidden="true" />
    <span class="sr-only">{{ intentLabel[intent] }}:</span>
    <div class="min-w-0 flex-1" :class="layout === 'inline' ? 'flex flex-wrap items-center gap-x-2' : ''">
      <p v-if="title" class="text-body-1-strong text-primary">{{ title }}</p>
      <div class="text-secondary" :class="layout === 'multiline' && title ? 'mt-0.5' : ''"><slot /></div>
      <div v-if="$slots.actions && layout === 'multiline'" class="mt-2 flex flex-wrap gap-2"><slot name="actions" /></div>
    </div>
    <div v-if="$slots.actions && layout === 'inline'" class="flex shrink-0 gap-2"><slot name="actions" /></div>
    <button
      v-if="dismissible"
      type="button"
      class="-my-1 -mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-secondary hover:bg-subtle-hover hover:text-primary focus-ring"
      aria-label="Dismiss"
      @click="$emit('dismiss')"
    >
      <X class="size-4" aria-hidden="true" />
    </button>
  </div>
</template>
