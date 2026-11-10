<script setup lang="ts">
import { onBeforeUnmount, ref, useId } from 'vue'
import { useFloating, type Placement } from '@/composables/useFloating'

/**
 * AkTooltip — short supplementary label shown on hover AND keyboard focus.
 * Dismissible with Esc and hoverable (WCAG 1.4.13). Do not put interactive
 * content in a tooltip — use AkPopover instead.
 *
 * `relationship="label"` makes the tooltip the trigger's accessible name
 * (for icon-only buttons); "description" adds it as aria-describedby.
 */
const props = withDefaults(
  defineProps<{
    content: string
    placement?: Placement
    relationship?: 'label' | 'description'
    delay?: number
    disabled?: boolean
  }>(),
  { placement: 'top', relationship: 'description', delay: 300 },
)
const id = useId()
const open = ref(false)
const anchor = ref<HTMLElement | null>(null)
const tip = ref<HTMLElement | null>(null)
const { style } = useFloating(anchor, tip, open, { placement: props.placement, offset: 6 })
let timer: ReturnType<typeof setTimeout> | undefined

function show() {
  if (props.disabled) return
  clearTimeout(timer)
  timer = setTimeout(() => (open.value = true), props.delay)
}
function hide() {
  clearTimeout(timer)
  timer = setTimeout(() => (open.value = false), 80)
}
function onFocusIn() {
  clearTimeout(timer)
  if (!props.disabled) open.value = true
}
function cancelHide() {
  clearTimeout(timer)
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    e.stopPropagation()
    open.value = false
  }
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <span
    ref="anchor"
    class="inline-flex"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="onFocusIn"
    @focusout="hide"
    @keydown="onKey"
  >
    <slot :tooltip-attrs="relationship === 'label' ? { 'aria-label': content } : { 'aria-describedby': id }" />
  </span>
  <Teleport to="body">
    <Transition name="ak-fade">
      <div
        v-if="open"
        :id="id"
        ref="tip"
        role="tooltip"
        :style="style"
        class="pointer-events-auto z-[var(--ak-z-tooltip)] max-w-60 rounded-md border border-line-subtle bg-surface-overlay px-2 py-1 text-caption-1 text-primary shadow-elevation-8 hc:border-line"
        @mouseenter="cancelHide"
        @mouseleave="hide"
      >
        {{ content }}
      </div>
    </Transition>
  </Teleport>
  <span v-if="relationship === 'description' && !open" :id="id" class="sr-only">{{ content }}</span>
</template>
