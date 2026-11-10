<script setup lang="ts">
import { computed, provide, useId } from 'vue'
import { CircleAlert, CircleCheck } from '@lucide/vue'
import { FIELD_KEY } from './fieldContext'

/**
 * AkField — label, helper text and validation message wrapper.
 * Any AkInput / AkSelect / AkTextarea / AkDatePicker placed inside
 * automatically receives the id, aria-describedby, aria-invalid and
 * required state, so forms are accessible by default.
 */
const props = withDefaults(
  defineProps<{
    label?: string
    /** Visually hide the label but keep it for screen readers. */
    hideLabel?: boolean
    required?: boolean
    optional?: boolean
    helper?: string
    error?: string | null
    success?: string | null
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
    orientation?: 'vertical' | 'horizontal'
    id?: string
  }>(),
  { size: 'md', orientation: 'vertical' },
)

const autoId = useId()
const id = computed(() => props.id ?? `field-${autoId}`)
const helperId = computed(() => `${id.value}-helper`)
const messageId = computed(() => `${id.value}-message`)
const invalid = computed(() => !!props.error)
const describedBy = computed(
  () => [props.helper ? helperId.value : '', props.error || props.success ? messageId.value : ''].filter(Boolean).join(' ') || undefined,
)

provide(FIELD_KEY, {
  id,
  describedBy,
  invalid,
  success: computed(() => !!props.success && !props.error),
  required: computed(() => props.required),
  disabled: computed(() => props.disabled),
  size: computed(() => props.size),
})
</script>

<template>
  <div
    class="min-w-0"
    :class="orientation === 'horizontal' ? 'grid gap-x-4 gap-y-1 sm:grid-cols-[minmax(120px,200px)_1fr] sm:items-start' : 'flex flex-col gap-1'"
  >
    <label
      v-if="label"
      :id="`${id}-label`"
      :for="id"
      class="text-body-1-strong"
      :class="[hideLabel ? 'sr-only' : '', disabled ? 'text-disabled' : 'text-primary', orientation === 'horizontal' ? 'sm:pt-1.5' : '']"
    >
      {{ label }}
      <span v-if="required" class="text-danger" aria-hidden="true">*</span>
      <span v-else-if="optional" class="font-normal text-tertiary">(optional)</span>
    </label>
    <div class="flex min-w-0 flex-col gap-1">
      <slot :id="id" :described-by="describedBy" :invalid="invalid" />
      <p
        v-if="error || success"
        :id="messageId"
        class="flex items-start gap-1 text-caption-1"
        :class="error ? 'text-danger' : 'text-success'"
        :aria-live="error ? 'polite' : undefined"
      >
        <CircleAlert v-if="error" class="mt-px size-3.5 shrink-0" aria-hidden="true" />
        <CircleCheck v-else class="mt-px size-3.5 shrink-0" aria-hidden="true" />
        <span>{{ error || success }}</span>
      </p>
      <p v-if="helper" :id="helperId" class="text-caption-1 text-tertiary">{{ helper }}</p>
      <slot name="after" />
    </div>
  </div>
</template>
