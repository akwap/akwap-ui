<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'
import { CalendarDays } from '@lucide/vue'
import AkCalendar from './AkCalendar.vue'
import { controlHeights, useField } from './fieldContext'
import { controlShell } from './controlClasses'
import { useFloating } from '@/composables/useFloating'
import { useClickOutside } from '@/composables/useClickOutside'
import { formatHuman, parseLooseDate } from '@/utils/date'

defineOptions({ inheritAttrs: false })

/**
 * AkDatePicker — typed date input with a calendar popover.
 * Users can type (e.g. "2026-11-10", "11/10/2026", "Nov 10 2026") or pick.
 * v-model is an ISO 'YYYY-MM-DD' string.
 */
const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    placeholder?: string
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    invalid?: boolean
    min?: string
    max?: string
    today?: string
    id?: string
  }>(),
  { placeholder: 'Select a date' },
)
const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>()
const attrs = useAttrs()
const field = useField()
const uid = useId()

const open = ref(false)
const text = ref(formatHuman(props.modelValue))
const parseError = ref(false)
const shell = ref<HTMLElement | null>(null)
const pop = ref<HTMLElement | null>(null)
const cal = ref<InstanceType<typeof AkCalendar> | null>(null)
const btn = ref<HTMLButtonElement | null>(null)
const { style } = useFloating(shell, pop, open, { placement: 'bottom-start' })

const size = computed(() => props.size ?? field?.size.value ?? 'md')
const disabled = computed(() => props.disabled || field?.disabled.value)
const invalid = computed(() => props.invalid || field?.invalid.value || parseError.value)

watch(() => props.modelValue, (v) => (text.value = formatHuman(v)))

function commit() {
  if (!text.value.trim()) {
    parseError.value = false
    emit('update:modelValue', null)
    return
  }
  const iso = parseLooseDate(text.value)
  parseError.value = !iso || (!!props.min && iso < props.min) || (!!props.max && iso > props.max)
  if (iso && !parseError.value) {
    emit('update:modelValue', iso)
    text.value = formatHuman(iso)
  }
}
async function toggle() {
  open.value = !open.value
  if (open.value) {
    await nextTick()
    cal.value?.focus()
  }
}
function pick(iso: string) {
  emit('update:modelValue', iso)
  parseError.value = false
  open.value = false
  btn.value?.focus()
}
function onPopKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    open.value = false
    btn.value?.focus()
  }
}
useClickOutside([shell, pop], () => (open.value = false))
</script>

<template>
  <div ref="shell" :class="[controlShell({ invalid, disabled }), controlHeights[size], 'pr-1', attrs.class]">
    <input
      :id="id ?? field?.id.value"
      v-model="text"
      v-bind="{ ...attrs, class: undefined }"
      type="text"
      autocomplete="off"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="field?.required.value"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="[field?.describedBy.value, parseError ? `${uid}-err` : ''].filter(Boolean).join(' ') || undefined"
      class="h-full min-w-0 flex-1 self-stretch bg-transparent text-primary outline-none placeholder:text-tertiary disabled:cursor-not-allowed"
      @blur="commit"
      @keydown.enter.prevent="commit"
      @keydown.down.alt.prevent="toggle"
    />
    <span v-if="parseError" :id="`${uid}-err`" class="sr-only">Enter a valid date</span>
    <button
      ref="btn"
      type="button"
      :disabled="disabled"
      class="inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-secondary hover:bg-subtle-hover hover:text-primary focus-ring disabled:text-disabled"
      :aria-label="modelValue ? `Change date, ${formatHuman(modelValue)}` : 'Choose date'"
      aria-haspopup="dialog"
      :aria-expanded="open ? 'true' : 'false'"
      @click="toggle"
    >
      <CalendarDays class="size-4" aria-hidden="true" />
    </button>
  </div>
  <Teleport to="body">
    <Transition name="ak-pop">
      <div
        v-if="open"
        ref="pop"
        role="dialog"
        aria-label="Choose date"
        :style="style"
        class="z-[var(--ak-z-popover)] rounded-overlay border border-line-subtle bg-surface-overlay p-3 shadow-elevation-16 hc:border-line"
        @keydown="onPopKey"
      >
        <AkCalendar ref="cal" :model-value="modelValue" :min="min" :max="max" :today="today" @update:model-value="pick" />
      </div>
    </Transition>
  </Teleport>
</template>
