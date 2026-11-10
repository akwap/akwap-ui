<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { ChevronDown } from '@lucide/vue'
import { controlHeights, useField } from './fieldContext'
import { controlShell } from './controlClasses'

defineOptions({ inheritAttrs: false })

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

/**
 * AkSelect — styled native <select>. Native selects give the best keyboard,
 * screen-reader and mobile experience for single choice from a list.
 */
const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    options?: (SelectOption | string)[]
    placeholder?: string
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    invalid?: boolean
    id?: string
  }>(),
  { options: () => [] },
)
const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()
const attrs = useAttrs()
const field = useField()

const normalized = computed<SelectOption[]>(() => props.options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o)))
const size = computed(() => props.size ?? field?.size.value ?? 'md')
const disabled = computed(() => props.disabled || field?.disabled.value)
const invalid = computed(() => props.invalid || field?.invalid.value)

function onChange(e: Event) {
  const raw = (e.target as HTMLSelectElement).value
  const match = normalized.value.find((o) => String(o.value) === raw)
  emit('update:modelValue', match ? match.value : raw)
}
</script>

<template>
  <div :class="[controlShell({ invalid, disabled, flush: true }), controlHeights[size], attrs.class]">
    <select
      :id="id ?? field?.id.value"
      v-bind="{ ...attrs, class: undefined }"
      :value="modelValue ?? ''"
      :disabled="disabled"
      :required="field?.required.value"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="field?.describedBy.value"
      class="h-full w-full min-w-0 cursor-pointer appearance-none self-stretch bg-transparent pr-8 pl-control-x text-primary outline-none disabled:cursor-not-allowed disabled:text-disabled [&>option]:bg-surface [&>option]:text-primary"
      :class="modelValue === null || modelValue === '' || modelValue === undefined ? 'text-tertiary' : ''"
      @change="onChange"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <slot>
        <option v-for="o in normalized" :key="o.value" :value="o.value" :disabled="o.disabled">{{ o.label }}</option>
      </slot>
    </select>
    <ChevronDown class="pointer-events-none absolute right-2.5 size-4 text-secondary" aria-hidden="true" />
  </div>
</template>
