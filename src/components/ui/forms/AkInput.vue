<script setup lang="ts">
import { computed, ref, useAttrs, type Component } from 'vue'
import { Eye, EyeOff, Minus, Plus, Search, X } from '@lucide/vue'
import { controlHeights, useField } from './fieldContext'
import { controlShell } from './controlClasses'

defineOptions({ inheritAttrs: false })

/**
 * AkInput — single-line text input. Covers text, email, password (with
 * show/hide), number (with stepper), search (with clear), tel and url.
 */
const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'
    size?: 'sm' | 'md' | 'lg'
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
    success?: boolean
    /** Show a clear (×) button when the field has a value. */
    clearable?: boolean
    /** Password fields get a show/hide toggle unless this is false. */
    revealable?: boolean
    leadingIcon?: Component
    min?: number
    max?: number
    step?: number
    id?: string
  }>(),
  { type: 'text', revealable: true, step: 1, modelValue: '' },
)
const emit = defineEmits<{ 'update:modelValue': [value: string | number | null]; clear: [] }>()
const attrs = useAttrs()
const field = useField()

const inputEl = ref<HTMLInputElement | null>(null)
const revealed = ref(false)

const size = computed(() => props.size ?? field?.size.value ?? 'md')
const disabled = computed(() => props.disabled || field?.disabled.value)
const invalid = computed(() => props.invalid || field?.invalid.value)
const success = computed(() => props.success || field?.success.value)
const nativeType = computed(() => (props.type === 'password' && revealed.value ? 'text' : props.type))
const leading = computed(() => props.leadingIcon ?? (props.type === 'search' ? Search : undefined))
const hasValue = computed(() => props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined)

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  if (props.type === 'number') emit('update:modelValue', v === '' ? null : Number(v))
  else emit('update:modelValue', v)
}
function clear() {
  emit('update:modelValue', props.type === 'number' ? null : '')
  emit('clear')
  inputEl.value?.focus()
}
function stepBy(dir: 1 | -1) {
  const current = typeof props.modelValue === 'number' ? props.modelValue : Number(props.modelValue) || 0
  let next = +(current + dir * props.step).toFixed(6)
  if (props.min !== undefined) next = Math.max(props.min, next)
  if (props.max !== undefined) next = Math.min(props.max, next)
  emit('update:modelValue', next)
}
function onKeydown(e: KeyboardEvent) {
  if (props.type === 'search' && e.key === 'Escape' && hasValue.value) {
    e.preventDefault()
    clear()
  }
}

const iconSize = computed(() => (size.value === 'lg' ? 'size-5' : 'size-4'))
defineExpose({ focus: () => inputEl.value?.focus(), el: inputEl })
</script>

<template>
  <div :class="[controlShell({ invalid, success, disabled, readonly }), controlHeights[size], attrs.class]" :style="attrs.style as any">
    <slot name="leading">
      <component :is="leading" v-if="leading" :class="['shrink-0 text-tertiary', iconSize]" aria-hidden="true" />
    </slot>
    <input
      :id="id ?? field?.id.value"
      ref="inputEl"
      v-bind="{ ...attrs, class: undefined, style: undefined }"
      :type="nativeType"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="field?.required.value || (attrs.required as boolean | undefined)"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="field?.describedBy.value"
      :min="min"
      :max="max"
      :step="type === 'number' ? step : undefined"
      :inputmode="type === 'number' ? 'decimal' : undefined"
      class="h-full min-w-0 flex-1 self-stretch bg-transparent text-primary outline-none placeholder:text-tertiary disabled:cursor-not-allowed disabled:text-disabled"
      @input="onInput"
      @keydown="onKeydown"
    />
    <button
      v-if="(clearable || type === 'search') && hasValue && !disabled && !readonly"
      type="button"
      class="-mr-1 inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-tertiary hover:bg-subtle-hover hover:text-primary focus-ring"
      aria-label="Clear"
      @click="clear"
    >
      <X class="size-4" aria-hidden="true" />
    </button>
    <button
      v-if="type === 'password' && revealable && !disabled"
      type="button"
      class="-mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-tertiary hover:bg-subtle-hover hover:text-primary focus-ring"
      :aria-label="revealed ? 'Hide password' : 'Show password'"
      :aria-pressed="revealed ? 'true' : 'false'"
      @click="revealed = !revealed"
    >
      <EyeOff v-if="revealed" :class="iconSize" aria-hidden="true" />
      <Eye v-else :class="iconSize" aria-hidden="true" />
    </button>
    <div v-if="type === 'number' && !readonly" class="-mr-2 flex shrink-0 items-center gap-0.5">
      <button
        type="button"
        tabindex="-1"
        class="inline-flex size-6 items-center justify-center rounded-sm text-secondary hover:bg-subtle-hover disabled:text-disabled"
        aria-label="Decrease"
        :disabled="disabled || (min !== undefined && Number(modelValue) <= min)"
        @click="stepBy(-1)"
      >
        <Minus class="size-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        tabindex="-1"
        class="inline-flex size-6 items-center justify-center rounded-sm text-secondary hover:bg-subtle-hover disabled:text-disabled"
        aria-label="Increase"
        :disabled="disabled || (max !== undefined && Number(modelValue) >= max)"
        @click="stepBy(1)"
      >
        <Plus class="size-3.5" aria-hidden="true" />
      </button>
    </div>
    <slot name="trailing" />
  </div>
</template>
