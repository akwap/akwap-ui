<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import type { Component } from 'vue'
import AkButton, { type ButtonSize } from './AkButton.vue'
import AkMenu, { type MenuItem } from '../overlays/AkMenu.vue'

/**
 * AkSplitButton — a primary action plus a menu of related actions.
 * The two halves are separate tab stops with their own accessible names.
 */
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline'
    size?: ButtonSize
    items: MenuItem[]
    icon?: Component
    disabled?: boolean
    loading?: boolean
    menuLabel?: string
  }>(),
  { variant: 'primary', size: 'md', menuLabel: 'More options' },
)
defineEmits<{ click: [e: MouseEvent] }>()
</script>

<template>
  <div class="inline-flex" role="group">
    <AkButton
      :variant="variant"
      :size="size"
      :icon="icon"
      :disabled="disabled"
      :loading="loading"
      class="rounded-r-none"
      @click="$emit('click', $event)"
    >
      <slot />
    </AkButton>
    <AkMenu :items="items" placement="bottom-end">
      <template #trigger="{ attrs }">
        <AkButton
          v-bind="attrs"
          :variant="variant"
          :size="size"
          :disabled="disabled || loading"
          icon-only
          :icon="ChevronDown"
          :aria-label="menuLabel"
          class="-ml-px rounded-l-none"
          :class="variant === 'primary' ? 'border-l-on-brand/30' : ''"
        >
          {{ menuLabel }}
        </AkButton>
      </template>
    </AkMenu>
  </div>
</template>
