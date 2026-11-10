<script setup lang="ts">
import { computed, inject, useId } from 'vue'
import { RADIO_KEY } from './radioContext'

/** AkRadio — use inside AkRadioGroup. */
const props = defineProps<{ value: string | number; label?: string; description?: string; disabled?: boolean }>()
const group = inject(RADIO_KEY)!
const uid = useId()
const id = `radio-${uid}`
const checked = computed(() => group.model.value === props.value)
const disabled = computed(() => props.disabled || group.disabled.value)
</script>

<template>
  <div class="inline-flex items-start gap-2">
    <span class="relative inline-flex size-5 shrink-0 items-center justify-center">
      <input
        :id="id"
        type="radio"
        :name="group.name"
        :value="value"
        :checked="checked"
        :disabled="disabled"
        :aria-describedby="description ? `${id}-desc` : undefined"
        class="peer absolute inset-0 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        @change="group.select(value)"
      />
      <span
        aria-hidden="true"
        class="pointer-events-none flex size-4 items-center justify-center rounded-full border transition-colors duration-faster peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-line-focus"
        :class="
          disabled
            ? 'border-line-disabled bg-control-disabled'
            : checked
              ? 'border-brand bg-control peer-hover:border-brand-hover'
              : group.invalid.value
                ? 'border-danger-strong bg-control'
                : 'border-line-strong bg-control peer-hover:border-fg-primary'
        "
      >
        <span v-if="checked" class="size-2 rounded-full" :class="disabled ? 'bg-fg-disabled' : 'bg-brand'" />
      </span>
    </span>
    <span class="flex flex-col pt-px">
      <label :for="id" class="cursor-pointer text-body-1" :class="disabled ? 'cursor-not-allowed text-disabled' : 'text-primary'">
        <slot>{{ label }}</slot>
      </label>
      <span v-if="description" :id="`${id}-desc`" class="text-caption-1 text-tertiary">{{ description }}</span>
    </span>
  </div>
</template>
