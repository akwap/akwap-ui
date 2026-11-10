<script setup lang="ts">
import { nextTick, ref, useId } from 'vue'
import { useFloating, type Placement } from '@/composables/useFloating'
import { useClickOutside } from '@/composables/useClickOutside'
import { getFocusable } from '@/composables/useFocusTrap'

/**
 * AkPopover — non-modal floating panel for rich, interactive content
 * (filters, mini-forms, details). Opens on click; Esc or outside click
 * closes; focus returns to the trigger.
 */
const props = withDefaults(
  defineProps<{
    placement?: Placement
    label?: string
    width?: string
    withArrow?: boolean
  }>(),
  { placement: 'bottom-start', width: 'auto' },
)
const emit = defineEmits<{ 'update:open': [open: boolean] }>()
const uid = useId()
const open = ref(false)
const anchor = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const { style } = useFloating(anchor, panel, open, { placement: props.placement, offset: 6 })

async function show() {
  open.value = true
  emit('update:open', true)
  await nextTick()
  if (panel.value) (getFocusable(panel.value)[0] ?? panel.value).focus()
}
function hide(focusTrigger = true) {
  if (!open.value) return
  open.value = false
  emit('update:open', false)
  if (focusTrigger) anchor.value?.querySelector<HTMLElement>('button, a, [tabindex]')?.focus()
}
function toggle() {
  if (open.value) hide()
  else show()
}
useClickOutside([anchor, panel], () => hide(false))
defineExpose({ show, hide, toggle })
</script>

<template>
  <span ref="anchor" class="inline-flex">
    <slot
      name="trigger"
      :open="open"
      :toggle="toggle"
      :attrs="{ 'aria-expanded': open, 'aria-controls': open ? `${uid}-pop` : undefined, 'aria-haspopup': 'dialog' as const, onClick: toggle }"
    />
  </span>
  <Teleport to="body">
    <Transition name="ak-pop">
      <div
        v-if="open"
        :id="`${uid}-pop`"
        ref="panel"
        role="dialog"
        :aria-label="label"
        tabindex="-1"
        :style="{ ...style, width }"
        class="z-[var(--ak-z-popover)] max-w-[calc(100vw-16px)] rounded-overlay border border-line-subtle bg-surface-overlay p-4 shadow-elevation-16 outline-none hc:border-line"
        @keydown.esc.stop.prevent="hide()"
      >
        <slot :close="hide" />
      </div>
    </Transition>
  </Teleport>
</template>
