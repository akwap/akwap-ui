<script setup lang="ts">
import { X } from '@lucide/vue'
import { useToast } from '@/composables/useToast'
import { intentClasses, intentIcon, intentLabel } from './intent'

/**
 * AkToaster — renders toasts created with useToast(). Mount once at the app
 * root. Hover or focus pauses auto-dismiss (WCAG 2.2.1 Timing Adjustable).
 */
withDefaults(defineProps<{ position?: 'bottom-end' | 'top-end' | 'bottom-center' }>(), { position: 'bottom-end' })
const { toasts, dismiss, pause, resume } = useToast()
</script>

<template>
  <div
    class="pointer-events-none fixed z-[var(--ak-z-toast)] flex w-full max-w-sm flex-col gap-2 p-4"
    :class="{
      'right-0 bottom-0': position === 'bottom-end',
      'top-0 right-0': position === 'top-end',
      'bottom-0 left-1/2 -translate-x-1/2': position === 'bottom-center',
    }"
    role="region"
    aria-label="Notifications"
  >
    <TransitionGroup name="ak-toast" tag="ol" class="flex flex-col gap-2" aria-live="polite">
      <li
        v-for="t in toasts"
        :key="t.id"
        :role="t.intent === 'danger' ? 'alert' : 'status'"
        class="pointer-events-auto flex items-start gap-3 rounded-overlay border border-line-subtle bg-surface-overlay p-3 shadow-elevation-16 hc:border-line"
        @mouseenter="pause(t.id)"
        @mouseleave="resume(t.id)"
        @focusin="pause(t.id)"
        @focusout="resume(t.id)"
      >
        <component :is="intentIcon[t.intent]" class="mt-px size-5 shrink-0" :class="intentClasses[t.intent].icon" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <p class="text-body-1-strong text-primary"><span class="sr-only">{{ intentLabel[t.intent] }}: </span>{{ t.title }}</p>
          <p v-if="t.description" class="mt-0.5 text-body-1 text-secondary">{{ t.description }}</p>
          <button
            v-if="t.action"
            type="button"
            class="mt-2 text-body-1-strong text-link hover:underline focus-ring"
            @click="t.action.onClick(), dismiss(t.id)"
          >
            {{ t.action.label }}
          </button>
        </div>
        <button type="button" class="-m-1 inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-secondary hover:bg-subtle-hover focus-ring" aria-label="Dismiss notification" @click="dismiss(t.id)">
          <X class="size-4" aria-hidden="true" />
        </button>
      </li>
    </TransitionGroup>
  </div>
</template>
