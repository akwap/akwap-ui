<script setup lang="ts">
import { computed, nextTick, ref, useId, type Component } from 'vue'
import { RouterLink } from 'vue-router'
import { Check } from '@lucide/vue'
import { useFloating, type Placement } from '@/composables/useFloating'
import { useClickOutside } from '@/composables/useClickOutside'

export interface MenuItem {
  key?: string
  label?: string
  icon?: Component
  shortcut?: string
  description?: string
  disabled?: boolean
  danger?: boolean
  /** Shows a check mark; renders as menuitemcheckbox. */
  checked?: boolean
  /** Section heading (non-interactive). */
  header?: boolean
  divider?: boolean
  onSelect?: () => void
  /** Optional router link. */
  to?: string
}

/**
 * AkMenu — accessible dropdown menu (WAI-ARIA menu button pattern).
 * Keyboard: Enter/Space/ArrowDown open, ↑/↓/Home/End move, type-ahead,
 * Esc/Tab close, focus returns to the trigger.
 */
const props = withDefaults(
  defineProps<{
    items: MenuItem[]
    placement?: Placement
    /** Accessible name of the menu if the trigger text is not enough. */
    label?: string
    minWidth?: string
  }>(),
  { placement: 'bottom-start', minWidth: '180px' },
)
const emit = defineEmits<{ select: [item: MenuItem]; 'update:open': [open: boolean] }>()

const open = ref(false)
const triggerWrap = ref<HTMLElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const activeIndex = ref(-1)
const id = useId()
const triggerId = `${id}-trigger`
const menuId = `${id}-menu`

const { style } = useFloating(triggerWrap, menu, open, { placement: props.placement })

const interactive = computed(() =>
  props.items.map((it, i) => ({ it, i })).filter(({ it }) => !it.divider && !it.header && !it.disabled),
)

function triggerEl(): HTMLElement | null {
  return triggerWrap.value?.querySelector<HTMLElement>('button, [role="button"], a') ?? null
}

async function show(focus: 'first' | 'last' = 'first') {
  open.value = true
  emit('update:open', true)
  await nextTick()
  const list = interactive.value
  activeIndex.value = focus === 'first' ? (list[0]?.i ?? -1) : (list[list.length - 1]?.i ?? -1)
  focusActive()
}
function hide(returnFocus = true) {
  if (!open.value) return
  open.value = false
  emit('update:open', false)
  activeIndex.value = -1
  if (returnFocus) triggerEl()?.focus()
}
function toggle() {
  if (open.value) hide()
  else show()
}
function focusActive() {
  nextTick(() => menu.value?.querySelector<HTMLElement>(`[data-index="${activeIndex.value}"]`)?.focus())
}
function move(delta: number) {
  const list = interactive.value
  if (!list.length) return
  const pos = list.findIndex((x) => x.i === activeIndex.value)
  const next = (pos + delta + list.length) % list.length
  activeIndex.value = list[next]!.i
  focusActive()
}
let typeahead = ''
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined
function onMenuKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      move(1)
      break
    case 'ArrowUp':
      e.preventDefault()
      move(-1)
      break
    case 'Home':
      e.preventDefault()
      activeIndex.value = interactive.value[0]?.i ?? -1
      focusActive()
      break
    case 'End':
      e.preventDefault()
      activeIndex.value = interactive.value[interactive.value.length - 1]?.i ?? -1
      focusActive()
      break
    case 'Escape':
      e.preventDefault()
      hide()
      break
    case 'Tab':
      hide(false)
      break
    default:
      if (e.key.length === 1 && /\S/.test(e.key)) {
        typeahead += e.key.toLowerCase()
        clearTimeout(typeaheadTimer)
        typeaheadTimer = setTimeout(() => (typeahead = ''), 500)
        const match = interactive.value.find(({ it }) => it.label?.toLowerCase().startsWith(typeahead))
        if (match) {
          activeIndex.value = match.i
          focusActive()
        }
      }
  }
}
function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    show('first')
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    show('last')
  }
}
function select(item: MenuItem) {
  if (item.disabled) return
  item.onSelect?.()
  emit('select', item)
  hide()
}

useClickOutside([triggerWrap, menu], () => hide(false))

defineExpose({ show, hide, toggle })
</script>

<template>
  <div ref="triggerWrap" class="inline-flex" @keydown="onTriggerKeydown">
    <slot
      name="trigger"
      :open="open"
      :toggle="toggle"
      :attrs="{
        id: triggerId,
        'aria-haspopup': 'menu' as const,
        'aria-expanded': open,
        'aria-controls': open ? menuId : undefined,
        onClick: toggle,
      }"
    />
  </div>
  <Teleport to="body">
    <Transition name="ak-pop">
      <div
        v-if="open"
        :id="menuId"
        ref="menu"
        role="menu"
        :aria-labelledby="label ? undefined : triggerId"
        :aria-label="label"
        tabindex="-1"
        :style="{ ...style, minWidth }"
        class="z-[var(--ak-z-popover)] max-h-[min(420px,calc(100vh-16px))] max-w-[calc(100vw-16px)] overflow-y-auto rounded-overlay border border-line-subtle bg-surface-overlay p-1 shadow-elevation-16 hc:border-line"
        @keydown="onMenuKeydown"
      >
        <template v-for="(item, i) in items" :key="item.key ?? item.label ?? `divider-${i}`">
          <div v-if="item.divider" role="separator" class="-mx-1 my-1 h-px bg-line-subtle" />
          <div v-else-if="item.header" role="presentation" class="px-2 pt-2 pb-1 text-caption-1-strong text-tertiary">
            {{ item.label }}
          </div>
          <component
            :is="item.to ? RouterLink : 'div'"
            v-else
            :to="item.to"
            :role="item.checked !== undefined ? 'menuitemcheckbox' : 'menuitem'"
            :aria-checked="item.checked !== undefined ? String(item.checked) : undefined"
            :aria-disabled="item.disabled ? 'true' : undefined"
            :data-index="i"
            tabindex="-1"
            class="flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-body-1 outline-none select-none focus-ring-inset [&_svg]:size-4"
            :class="[
              item.disabled
                ? 'cursor-not-allowed text-disabled'
                : item.danger
                  ? 'text-danger hover:bg-danger-background focus:bg-danger-background'
                  : 'text-primary hover:bg-subtle-hover focus:bg-subtle-hover',
            ]"
            @click="select(item)"
            @keydown.enter.prevent="select(item)"
            @keydown.space.prevent="select(item)"
            @mouseenter="!item.disabled && ((activeIndex = i), focusActive())"
          >
            <span v-if="items.some((x) => x.checked !== undefined)" class="flex w-4 shrink-0 justify-center">
              <Check v-if="item.checked" aria-hidden="true" />
            </span>
            <component :is="item.icon" v-if="item.icon" aria-hidden="true" class="shrink-0 text-secondary" :class="item.danger && 'text-danger'" />
            <span class="min-w-0 flex-1">
              <span class="block truncate">{{ item.label }}</span>
              <span v-if="item.description" class="block text-caption-1 text-tertiary">{{ item.description }}</span>
            </span>
            <kbd v-if="item.shortcut" class="ml-4 font-sans text-caption-1 text-tertiary">{{ item.shortcut }}</kbd>
          </component>
        </template>
        <slot name="footer" />
      </div>
    </Transition>
  </Teleport>
</template>
