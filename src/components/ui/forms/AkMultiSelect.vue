<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'
import { Check, ChevronDown, Search, X } from '@lucide/vue'
import { controlMinHeights, useField } from './fieldContext'
import { controlShell } from './controlClasses'
import { useFloating } from '@/composables/useFloating'
import { useClickOutside } from '@/composables/useClickOutside'

defineOptions({ inheritAttrs: false })

export interface MultiOption {
  label: string
  value: string | number
  description?: string
  disabled?: boolean
}

/**
 * AkMultiSelect — choose several options from a filterable list.
 * Pattern: button + popup listbox (aria-multiselectable) with a search box.
 * Keyboard: ↓/↑ move, Enter/Space toggle, Esc closes, Backspace in the
 * filter box removes the last chip.
 */
const props = withDefaults(
  defineProps<{
    modelValue?: (string | number)[]
    options: MultiOption[]
    placeholder?: string
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    invalid?: boolean
    searchable?: boolean
    /** Collapse chips into "+N" after this many. */
    maxChips?: number
    id?: string
  }>(),
  { modelValue: () => [], placeholder: 'Select…', searchable: true, maxChips: 3 },
)
const emit = defineEmits<{ 'update:modelValue': [value: (string | number)[]] }>()
const field = useField()
const attrs = useAttrs()
const uid = useId()
const listId = `${uid}-list`

const open = ref(false)
const query = ref('')
const active = ref(0)
const trigger = ref<HTMLElement | null>(null)
const popup = ref<HTMLElement | null>(null)
const searchEl = ref<HTMLInputElement | null>(null)
const { style } = useFloating(trigger, popup, open, { matchWidth: true })

const size = computed(() => props.size ?? field?.size.value ?? 'md')
const disabled = computed(() => props.disabled || field?.disabled.value)
const invalid = computed(() => props.invalid || field?.invalid.value)
const selected = computed(() => props.options.filter((o) => props.modelValue.includes(o.value)))
const filtered = computed(() =>
  props.options.filter((o) => o.label.toLowerCase().includes(query.value.trim().toLowerCase())),
)

function toggle(o: MultiOption) {
  if (o.disabled) return
  const has = props.modelValue.includes(o.value)
  emit('update:modelValue', has ? props.modelValue.filter((v) => v !== o.value) : [...props.modelValue, o.value])
}
function remove(v: string | number) {
  emit('update:modelValue', props.modelValue.filter((x) => x !== v))
}
async function openList() {
  if (disabled.value) return
  open.value = true
  active.value = 0
  await nextTick()
  if (props.searchable) searchEl.value?.focus()
  else popup.value?.focus()
}
function close(focusTrigger = true) {
  open.value = false
  query.value = ''
  if (focusTrigger) trigger.value?.querySelector<HTMLElement>('[role="combobox"]')?.focus()
}
function onKey(e: KeyboardEvent) {
  const n = filtered.value.length
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    active.value = (active.value + 1) % Math.max(n, 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    active.value = (active.value - 1 + n) % Math.max(n, 1)
  } else if (e.key === 'Enter' || (e.key === ' ' && !props.searchable)) {
    e.preventDefault()
    const o = filtered.value[active.value]
    if (o) toggle(o)
  } else if (e.key === 'Escape') {
    e.preventDefault()
    close()
  } else if (e.key === 'Tab') {
    close(false)
  } else if (e.key === 'Backspace' && !query.value && props.modelValue.length) {
    remove(props.modelValue[props.modelValue.length - 1]!)
  }
}
watch(query, () => (active.value = 0))
watch(active, () => nextTick(() => popup.value?.querySelector(`#${CSS.escape(`${uid}-opt-${active.value}`)}`)?.scrollIntoView({ block: 'nearest' })))
useClickOutside([trigger, popup], () => open.value && close(false))
</script>

<template>
  <div ref="trigger" :class="[controlShell({ invalid, disabled }), controlMinHeights[size], 'cursor-pointer flex-wrap py-0.5 pr-8', attrs.class]" @click="open ? close() : openList()">
    <span
      :id="id ?? field?.id.value"
      role="combobox"
      tabindex="0"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="listId"
      aria-haspopup="listbox"
      :aria-disabled="disabled ? 'true' : undefined"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="field?.describedBy.value"
      :aria-labelledby="field ? `${field.id.value}-label` : undefined"
      :aria-label="attrs['aria-label'] as string | undefined"
      class="flex min-w-0 flex-1 flex-wrap items-center gap-1 outline-none"
      @keydown.down.prevent="openList"
      @keydown.enter.prevent="openList"
      @keydown.space.prevent="openList"
    >
      <span v-if="!selected.length" class="truncate text-tertiary">{{ placeholder }}</span>
      <span
        v-for="o in selected.slice(0, maxChips)"
        :key="o.value"
        class="inline-flex max-w-full items-center gap-1 rounded-sm bg-surface-selected py-0.5 pr-0.5 pl-1.5 text-caption-1 text-primary"
      >
        <span class="truncate">{{ o.label }}</span>
        <button
          v-if="!disabled"
          type="button"
          class="inline-flex size-4 items-center justify-center rounded-sm hover:bg-subtle-pressed focus-ring"
          :aria-label="`Remove ${o.label}`"
          @click.stop="remove(o.value)"
        >
          <X class="size-3" aria-hidden="true" />
        </button>
      </span>
      <span v-if="selected.length > maxChips" class="text-caption-1 text-secondary">+{{ selected.length - maxChips }} more</span>
      <span class="sr-only">{{ selected.length }} selected</span>
    </span>
    <ChevronDown class="pointer-events-none absolute right-2.5 size-4 text-secondary transition-transform" :class="open && 'rotate-180'" aria-hidden="true" />
  </div>
  <Teleport to="body">
    <Transition name="ak-pop">
      <div
        v-if="open"
        ref="popup"
        :style="style"
        tabindex="-1"
        class="z-[var(--ak-z-popover)] flex max-h-72 flex-col overflow-hidden rounded-overlay border border-line-subtle bg-surface-overlay shadow-elevation-16 outline-none hc:border-line"
        @keydown="onKey"
      >
        <div v-if="searchable" class="flex items-center gap-2 border-b border-line-subtle px-3">
          <Search class="size-4 text-tertiary" aria-hidden="true" />
          <input
            ref="searchEl"
            v-model="query"
            type="text"
            aria-label="Filter options"
            :aria-controls="listId"
            :aria-activedescendant="filtered.length ? `${uid}-opt-${active}` : undefined"
            placeholder="Search…"
            class="h-9 min-w-0 flex-1 bg-transparent text-body-1 text-primary outline-none placeholder:text-tertiary"
          />
        </div>
        <ul :id="listId" role="listbox" aria-multiselectable="true" class="flex-1 overflow-y-auto p-1">
          <li
            v-for="(o, i) in filtered"
            :id="`${uid}-opt-${i}`"
            :key="o.value"
            role="option"
            :aria-selected="modelValue.includes(o.value) ? 'true' : 'false'"
            :aria-disabled="o.disabled ? 'true' : undefined"
            class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-body-1"
            :class="[o.disabled ? 'cursor-not-allowed text-disabled' : 'text-primary', i === active ? 'bg-subtle-hover outline-2 -outline-offset-2 outline-line-focus/0' : '']"
            @mouseenter="active = i"
            @click="toggle(o)"
          >
            <span
              class="flex size-4 shrink-0 items-center justify-center rounded-sm border"
              :class="modelValue.includes(o.value) ? 'border-brand bg-brand text-on-brand' : 'border-line-strong'"
              aria-hidden="true"
            >
              <Check v-if="modelValue.includes(o.value)" class="size-3" :stroke-width="3" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate">{{ o.label }}</span>
              <span v-if="o.description" class="block text-caption-1 text-tertiary">{{ o.description }}</span>
            </span>
          </li>
          <li v-if="!filtered.length" role="presentation" class="px-2 py-3 text-center text-caption-1 text-tertiary">No matches for “{{ query }}”</li>
        </ul>
        <div class="flex items-center justify-between border-t border-line-subtle px-3 py-1.5 text-caption-1 text-secondary">
          <span>{{ modelValue.length }} selected</span>
          <button v-if="modelValue.length" type="button" class="link" @click="emit('update:modelValue', [])">Clear all</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
