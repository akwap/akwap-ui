<script setup lang="ts">
import { computed, ref, useId, watchEffect } from 'vue'
import { Check, Minus } from '@lucide/vue'

/**
 * AkCheckbox — native checkbox with custom visuals.
 * v-model can be a boolean, or an array when `value` is set (checkbox group).
 */
const props = withDefaults(
  defineProps<{
    modelValue?: boolean | unknown[]
    value?: unknown
    label?: string
    description?: string
    indeterminate?: boolean
    disabled?: boolean
    invalid?: boolean
    required?: boolean
    size?: 'md' | 'lg'
    shape?: 'square' | 'circular'
    labelPosition?: 'after' | 'before'
    id?: string
  }>(),
  { modelValue: false, size: 'md', shape: 'square', labelPosition: 'after' },
)
const emit = defineEmits<{ 'update:modelValue': [value: boolean | unknown[]]; change: [checked: boolean] }>()

const uid = useId()
const inputId = computed(() => props.id ?? `cb-${uid}`)
const input = ref<HTMLInputElement | null>(null)

const checked = computed(() =>
  Array.isArray(props.modelValue) ? props.modelValue.includes(props.value) : !!props.modelValue,
)
watchEffect(() => {
  if (input.value) input.value.indeterminate = !!props.indeterminate
})

function onChange(e: Event) {
  const isChecked = (e.target as HTMLInputElement).checked
  if (Array.isArray(props.modelValue)) {
    const next = props.modelValue.filter((v) => v !== props.value)
    if (isChecked) next.push(props.value)
    emit('update:modelValue', next)
  } else emit('update:modelValue', isChecked)
  emit('change', isChecked)
}
const on = computed(() => checked.value || props.indeterminate)
</script>

<template>
  <div class="inline-flex items-start gap-2" :class="labelPosition === 'before' ? 'flex-row-reverse' : ''">
    <span class="relative inline-flex shrink-0 items-center justify-center" :class="size === 'lg' ? 'size-6' : 'size-5'">
      <input
        :id="inputId"
        ref="input"
        type="checkbox"
        class="peer absolute inset-0 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        :checked="checked"
        :disabled="disabled"
        :required="required"
        :value="value"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="description ? `${inputId}-desc` : undefined"
        @change="onChange"
      />
      <span
        aria-hidden="true"
        class="pointer-events-none flex items-center justify-center border transition-colors duration-faster ease-standard peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-line-focus"
        :class="[
          size === 'lg' ? 'size-5 [&_svg]:size-4' : 'size-4 [&_svg]:size-3',
          shape === 'circular' ? 'rounded-full' : 'rounded-sm',
          disabled
            ? 'border-line-disabled bg-control-disabled text-disabled'
            : on
              ? 'border-brand bg-brand text-on-brand peer-hover:bg-brand-hover peer-hover:border-brand-hover'
              : invalid
                ? 'border-danger-strong bg-control'
                : 'border-line-strong bg-control peer-hover:border-fg-primary',
        ]"
      >
        <Minus v-if="indeterminate" :stroke-width="3" />
        <Check v-else-if="checked" :stroke-width="3" />
      </span>
    </span>
    <span v-if="label || $slots.default" class="flex min-w-0 flex-col pt-px">
      <label :for="inputId" class="cursor-pointer text-body-1" :class="disabled ? 'cursor-not-allowed text-disabled' : 'text-primary'">
        <slot>{{ label }}</slot>
        <span v-if="required" class="text-danger" aria-hidden="true"> *</span>
      </label>
      <span v-if="description" :id="`${inputId}-desc`" class="text-caption-1 text-tertiary">{{ description }}</span>
    </span>
  </div>
</template>
