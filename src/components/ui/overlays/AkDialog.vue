<script setup lang="ts">
import { computed, ref, toRef, useId } from 'vue'
import { X } from '@lucide/vue'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useScrollLock } from '@/composables/useScrollLock'

/**
 * AkDialog — modal dialog (WAI-ARIA dialog pattern).
 * - Focus moves inside on open, is trapped while open, and is restored to
 *   the trigger on close.
 * - Esc closes; backdrop click closes unless `role="alertdialog"` or
 *   `persistent`.
 * - On small screens the dialog becomes a bottom sheet.
 */
const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    description?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    role?: 'dialog' | 'alertdialog'
    persistent?: boolean
    hideClose?: boolean
    /** CSS selector inside the dialog to focus first. */
    initialFocus?: string
  }>(),
  { size: 'md', role: 'dialog' },
)
const emit = defineEmits<{ 'update:open': [open: boolean]; close: [] }>()
const uid = useId()
const panel = ref<HTMLElement | null>(null)
const isOpen = toRef(props, 'open')

useFocusTrap(panel, isOpen, { initialFocus: () => (props.initialFocus ? panel.value?.querySelector<HTMLElement>(props.initialFocus) : null) })
useScrollLock(isOpen)

const canDismissByBackdrop = computed(() => props.role !== 'alertdialog' && !props.persistent)
function close() {
  emit('update:open', false)
  emit('close')
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && !props.persistent) {
    e.stopPropagation()
    close()
  }
}
const width = computed(() => ({ sm: 'sm:max-w-sm', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' })[props.size])
</script>

<template>
  <Teleport to="body">
    <Transition name="ak-fade">
      <div v-if="open" class="fixed inset-0 z-[var(--ak-z-modal)] bg-backdrop" aria-hidden="true" @click="canDismissByBackdrop && close()" />
    </Transition>
    <Transition name="ak-dialog">
      <div
        v-if="open"
        class="pointer-events-none fixed inset-0 z-[var(--ak-z-modal)] flex items-end justify-center sm:items-center sm:p-6"
        @keydown="onKey"
      >
        <div
          ref="panel"
          :role="role"
          aria-modal="true"
          :aria-labelledby="`${uid}-title`"
          :aria-describedby="description ? `${uid}-desc` : undefined"
          tabindex="-1"
          class="pointer-events-auto flex max-h-[92dvh] w-full flex-col rounded-t-overlay border border-line-subtle bg-surface-overlay shadow-elevation-28 outline-none sm:max-h-[85dvh] sm:rounded-overlay hc:border-line"
          :class="width"
        >
          <header class="flex items-start gap-3 px-6 pt-5 pb-2">
            <div class="min-w-0 flex-1">
              <h2 :id="`${uid}-title`" class="text-subtitle-1 text-primary">{{ title }}</h2>
              <p v-if="description" :id="`${uid}-desc`" class="mt-1 text-body-1 text-secondary">{{ description }}</p>
            </div>
            <button
              v-if="!hideClose"
              type="button"
              class="-mt-1 -mr-2 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-secondary hover:bg-subtle-hover hover:text-primary focus-ring"
              aria-label="Close"
              @click="close"
            >
              <X class="size-5" aria-hidden="true" />
            </button>
          </header>
          <div class="min-h-0 flex-1 overflow-y-auto px-6 py-2 text-body-1 text-secondary">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="flex flex-col-reverse gap-2 px-6 pt-4 pb-5 sm:flex-row sm:justify-end">
            <slot name="footer" :close="close" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
