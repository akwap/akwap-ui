<script setup lang="ts">
import { computed } from 'vue'
import { Check, Minus, X, Clock, Pause } from '@lucide/vue'

export type Status = 'active' | 'inactive' | 'pending' | 'suspended' | 'error' | 'online' | 'away' | 'busy' | 'offline'

/**
 * AkStatusIndicator — status shown with colour + shape glyph + text,
 * so it is distinguishable without colour vision.
 */
const props = withDefaults(defineProps<{ status: Status; label?: string; size?: 'sm' | 'md' }>(), { size: 'md' })
const cfg = computed(
  () =>
    ({
      active: { label: 'Active', cls: 'bg-success-strong', icon: Check },
      online: { label: 'Online', cls: 'bg-success-strong', icon: Check },
      inactive: { label: 'Inactive', cls: 'bg-fg-tertiary', icon: Minus },
      offline: { label: 'Offline', cls: 'bg-fg-tertiary', icon: Minus },
      pending: { label: 'Pending', cls: 'bg-warning-strong', icon: Clock },
      away: { label: 'Away', cls: 'bg-warning-strong', icon: Clock },
      suspended: { label: 'Suspended', cls: 'bg-danger-strong', icon: Pause },
      busy: { label: 'Busy', cls: 'bg-danger-strong', icon: Minus },
      error: { label: 'Error', cls: 'bg-danger-strong', icon: X },
    })[props.status],
)
</script>

<template>
  <span class="inline-flex items-center gap-1.5 text-primary" :class="size === 'sm' ? 'text-caption-1' : 'text-body-1'">
    <span class="flex shrink-0 items-center justify-center rounded-full text-on-brand" :class="[cfg.cls, size === 'sm' ? 'size-3' : 'size-3.5']" aria-hidden="true">
      <component :is="cfg.icon" class="size-2.5" :stroke-width="3" />
    </span>
    {{ label ?? cfg.label }}
  </span>
</template>
