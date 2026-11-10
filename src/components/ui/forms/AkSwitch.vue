<script setup lang="ts">
import { computed, useId } from 'vue'
import { Check } from '@lucide/vue'

/**
 * AkSwitch — immediate on/off setting. Native checkbox with role="switch",
 * so Space toggles and screen readers announce "on/off".
 */
const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    label?: string
    description?: string
    disabled?: boolean
    labelPosition?: 'after' | 'before'
    size?: 'md' | 'lg'
    id?: string
  }>(),
  { modelValue: false, labelPosition: 'after', size: 'md' },
)
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const uid = useId()
const id = computed(() => props.id ?? `sw-${uid}`)
</script>

<template>
  <div class="inline-flex items-start gap-3" :class="labelPosition === 'before' ? 'w-full flex-row-reverse justify-between' : ''">
    <span class="relative inline-flex shrink-0" :class="size === 'lg' ? 'h-6 w-12' : 'h-5 w-10'">
      <input
        :id="id"
        type="checkbox"
        role="switch"
        :checked="modelValue"
        :disabled="disabled"
        :aria-describedby="description ? `${id}-desc` : undefined"
        class="peer absolute inset-0 z-10 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 rounded-full border transition-colors duration-fast ease-standard peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-line-focus"
        :class="
          disabled
            ? 'border-line-disabled bg-control-disabled'
            : modelValue
              ? 'border-transparent bg-brand peer-hover:bg-brand-hover'
              : 'border-line-strong bg-control peer-hover:border-fg-primary'
        "
      />
      <span
        aria-hidden="true"
        class="pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full transition-[left,background-color] duration-fast ease-decelerate"
        :class="[
          size === 'lg' ? 'size-4' : 'size-3.5',
          modelValue
            ? [size === 'lg' ? 'left-[calc(100%-20px)]' : 'left-[calc(100%-17px)]', disabled ? 'bg-fg-disabled' : 'bg-on-brand']
            : ['left-[3px]', disabled ? 'bg-fg-disabled' : 'bg-fg-secondary'],
        ]"
      >
        <Check v-if="modelValue && size === 'lg'" class="size-2.5 text-brand" :stroke-width="3" />
      </span>
    </span>
    <span v-if="label || $slots.default" class="flex min-w-0 flex-col">
      <label :for="id" class="cursor-pointer text-body-1" :class="disabled ? 'cursor-not-allowed text-disabled' : 'text-primary'">
        <slot>{{ label }}</slot>
      </label>
      <span v-if="description" :id="`${id}-desc`" class="text-caption-1 text-tertiary">{{ description }}</span>
    </span>
  </div>
</template>
