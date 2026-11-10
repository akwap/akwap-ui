<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'
import { Clock } from '@lucide/vue'
import { controlHeights, useField } from './fieldContext'
import { controlShell } from './controlClasses'
import { useFloating } from '@/composables/useFloating'
import { useClickOutside } from '@/composables/useClickOutside'

defineOptions({ inheritAttrs: false })

/**
 * AkTimePicker — editable combobox with a list of times.
 * v-model is 24h "HH:mm". Users can type "9:30 pm", "21:30" or pick.
 */
const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    /** Minutes between suggestions. */
    step?: number
    hour12?: boolean
    min?: string
    max?: string
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    invalid?: boolean
    placeholder?: string
    id?: string
  }>(),
  { step: 30, hour12: true, placeholder: 'Select a time' },
)
const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>()
const attrs = useAttrs()
const field = useField()
const uid = useId()

const open = ref(false)
const active = ref(-1)
const shell = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)
const { style } = useFloating(shell, list, open, { matchWidth: true })

const pad = (n: number) => String(n).padStart(2, '0')
function display(v: string | null | undefined) {
  if (!v) return ''
  const [h, m] = v.split(':').map(Number) as [number, number]
  if (!props.hour12) return `${pad(h)}:${pad(m)}`
  return `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`
}
function parse(s: string): string | null {
  const m = /^\s*(\d{1,2})(?::?(\d{2}))?\s*(a|am|p|pm)?\s*$/i.exec(s)
  if (!m) return null
  let h = Number(m[1])
  const min = Number(m[2] ?? 0)
  const ap = m[3]?.toLowerCase()
  if (ap) {
    if (h < 1 || h > 12) return null
    if (ap.startsWith('p') && h !== 12) h += 12
    if (ap.startsWith('a') && h === 12) h = 0
  }
  if (h > 23 || min > 59) return null
  return `${pad(h)}:${pad(min)}`
}

const text = ref(display(props.modelValue))
watch(() => props.modelValue, (v) => (text.value = display(v)))

const options = computed(() => {
  const out: string[] = []
  for (let t = 0; t < 24 * 60; t += props.step) {
    const v = `${pad(Math.floor(t / 60))}:${pad(t % 60)}`
    if ((props.min && v < props.min) || (props.max && v > props.max)) continue
    out.push(v)
  }
  return out
})
const error = ref(false)
const size = computed(() => props.size ?? field?.size.value ?? 'md')
const disabled = computed(() => props.disabled || field?.disabled.value)
const invalid = computed(() => props.invalid || field?.invalid.value || error.value)

function commit() {
  if (!text.value.trim()) {
    error.value = false
    return emit('update:modelValue', null)
  }
  const v = parse(text.value)
  error.value = !v
  if (v) {
    emit('update:modelValue', v)
    text.value = display(v)
  }
}
async function show() {
  if (disabled.value) return
  open.value = true
  active.value = Math.max(0, options.value.findIndex((o) => o >= (props.modelValue ?? '09:00')))
  await nextTick()
  list.value?.querySelector(`[data-i="${active.value}"]`)?.scrollIntoView({ block: 'center' })
}
function pick(v: string) {
  emit('update:modelValue', v)
  error.value = false
  open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    if (!open.value) return show()
    active.value = Math.min(options.value.length - 1, Math.max(0, active.value + (e.key === 'ArrowDown' ? 1 : -1)))
    nextTick(() => list.value?.querySelector(`[data-i="${active.value}"]`)?.scrollIntoView({ block: 'nearest' }))
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (open.value && active.value >= 0) pick(options.value[active.value]!)
    else commit()
  } else if (e.key === 'Escape' && open.value) {
    e.preventDefault()
    open.value = false
  }
}
useClickOutside([shell, list], () => (open.value = false))
</script>

<template>
  <div ref="shell" :class="[controlShell({ invalid, disabled }), controlHeights[size], attrs.class]">
    <Clock class="size-4 shrink-0 text-tertiary" aria-hidden="true" />
    <input
      :id="id ?? field?.id.value"
      v-model="text"
      v-bind="{ ...attrs, class: undefined }"
      type="text"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="`${uid}-list`"
      :aria-activedescendant="open && active >= 0 ? `${uid}-opt-${active}` : undefined"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="field?.describedBy.value"
      :placeholder="placeholder"
      :disabled="disabled"
      class="h-full min-w-0 flex-1 self-stretch bg-transparent text-primary outline-none placeholder:text-tertiary"
      @focus="show"
      @click="show"
      @blur="commit"
      @keydown="onKey"
    />
  </div>
  <Teleport to="body">
    <ul
      v-if="open"
      :id="`${uid}-list`"
      ref="list"
      role="listbox"
      :style="style"
      class="z-[var(--ak-z-popover)] max-h-60 overflow-y-auto rounded-overlay border border-line-subtle bg-surface-overlay p-1 shadow-elevation-16 hc:border-line"
    >
      <li
        v-for="(o, i) in options"
        :id="`${uid}-opt-${i}`"
        :key="o"
        :data-i="i"
        role="option"
        :aria-selected="o === modelValue ? 'true' : 'false'"
        class="cursor-pointer rounded-md px-2 py-1.5 text-body-1 tabular-nums"
        :class="[o === modelValue ? 'bg-brand-subtle font-semibold text-brand' : 'text-primary', i === active ? 'bg-subtle-hover' : '']"
        @mousedown.prevent="pick(o)"
        @mouseenter="active = i"
      >
        {{ display(o) }}
      </li>
    </ul>
  </Teleport>
</template>
