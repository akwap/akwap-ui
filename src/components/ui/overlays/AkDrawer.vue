<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { X } from '@lucide/vue'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useScrollLock } from '@/composables/useScrollLock'

/**
 * AkDrawer — panel that slides in from an edge.
 * type="overlay" (default) is modal: focus trap, scroll lock, Esc, backdrop.
 * type="inline" is a non-modal side panel rendered in the layout flow.
 */
const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    side?: 'left' | 'right' | 'bottom'
    size?: 'sm' | 'md' | 'lg' | 'full'
    type?: 'overlay' | 'inline'
    hideClose?: boolean
    /** For drawers whose content provides its own heading. */
    ariaLabel?: string
  }>(),
  { side: 'right', size: 'md', type: 'overlay' },
)
const emit = defineEmits<{ 'update:open': [open: boolean] }>()
const uid = useId()
const panel = ref<HTMLElement | null>(null)
const modalOpen = computed(() => props.open && props.type === 'overlay')
useFocusTrap(panel, modalOpen)
useScrollLock(modalOpen)

const sizeClass = computed(() => {
  if (props.side === 'bottom') return { sm: 'max-h-[40dvh]', md: 'max-h-[60dvh]', lg: 'max-h-[85dvh]', full: 'h-dvh' }[props.size]
  return { sm: 'w-[min(320px,100vw)]', md: 'w-[min(400px,100vw)]', lg: 'w-[min(640px,100vw)]', full: 'w-screen' }[props.size]
})
const posClass = computed(
  () => ({ left: 'inset-y-0 left-0 border-r', right: 'inset-y-0 right-0 border-l', bottom: 'inset-x-0 bottom-0 border-t rounded-t-overlay' })[props.side],
)
function close() {
  emit('update:open', false)
}
</script>

<template>
  <Teleport to="body" :disabled="type === 'inline'">
    <Transition v-if="type === 'overlay'" name="ak-fade">
      <div v-if="open" class="fixed inset-0 z-[var(--ak-z-modal)] bg-backdrop" aria-hidden="true" @click="close" />
    </Transition>
    <Transition :name="`ak-drawer-${side}`">
      <aside
        v-if="open"
        ref="panel"
        :role="type === 'overlay' ? 'dialog' : 'complementary'"
        :aria-modal="type === 'overlay' ? 'true' : undefined"
        :aria-labelledby="title ? `${uid}-title` : undefined"
        :aria-label="title ? undefined : ariaLabel"
        tabindex="-1"
        class="flex flex-col border-line-subtle bg-surface-overlay outline-none hc:border-line"
        :class="[type === 'overlay' ? ['fixed z-[var(--ak-z-modal)] shadow-elevation-28', posClass] : 'h-full border-l', sizeClass]"
        @keydown.esc.stop="close"
      >
        <header v-if="title || !hideClose" class="flex items-center gap-3 border-b border-line-subtle px-5 py-3">
          <h2 v-if="title" :id="`${uid}-title`" class="min-w-0 flex-1 truncate text-subtitle-2 text-primary">{{ title }}</h2>
          <slot name="header-actions" />
          <button
            v-if="!hideClose"
            type="button"
            class="ml-auto inline-flex size-8 items-center justify-center rounded-md text-secondary hover:bg-subtle-hover hover:text-primary focus-ring"
            aria-label="Close panel"
            @click="close"
          >
            <X class="size-5" aria-hidden="true" />
          </button>
        </header>
        <div class="min-h-0 flex-1 overflow-y-auto">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="flex justify-end gap-2 border-t border-line-subtle px-5 py-3">
          <slot name="footer" :close="close" />
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>
