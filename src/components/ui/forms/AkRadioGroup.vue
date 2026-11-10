<script setup lang="ts">
import { computed, provide, useId } from 'vue'
import { RADIO_KEY } from './radioContext'
import AkRadio from './AkRadio.vue'

/**
 * AkRadioGroup — a set of mutually exclusive options. Renders a
 * <fieldset>/<legend> so the group label is announced. Arrow keys move
 * between options (native radio behaviour).
 */
const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    label?: string
    hideLabel?: boolean
    options?: { label: string; value: string | number; description?: string; disabled?: boolean }[]
    orientation?: 'vertical' | 'horizontal'
    disabled?: boolean
    required?: boolean
    error?: string
    helper?: string
    name?: string
  }>(),
  { orientation: 'vertical' },
)
const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()
const uid = useId()

provide(RADIO_KEY, {
  name: props.name ?? `radio-${uid}`,
  model: computed(() => props.modelValue),
  disabled: computed(() => props.disabled),
  invalid: computed(() => !!props.error),
  select: (v) => emit('update:modelValue', v),
})
</script>

<template>
  <fieldset
    class="m-0 min-w-0 border-0 p-0"
    :aria-describedby="[error ? `${uid}-err` : '', helper ? `${uid}-help` : ''].filter(Boolean).join(' ') || undefined"
    :aria-required="required ? 'true' : undefined"
  >
    <legend v-if="label" class="mb-2 p-0 text-body-1-strong text-primary" :class="hideLabel && 'sr-only'">
      {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
    </legend>
    <div class="flex gap-3" :class="orientation === 'horizontal' ? 'flex-row flex-wrap gap-x-6' : 'flex-col'">
      <slot>
        <AkRadio v-for="o in options" :key="o.value" :value="o.value" :label="o.label" :description="o.description" :disabled="o.disabled" />
      </slot>
    </div>
    <p v-if="error" :id="`${uid}-err`" class="mt-1 text-caption-1 text-danger">{{ error }}</p>
    <p v-if="helper" :id="`${uid}-help`" class="mt-1 text-caption-1 text-tertiary">{{ helper }}</p>
  </fieldset>
</template>
