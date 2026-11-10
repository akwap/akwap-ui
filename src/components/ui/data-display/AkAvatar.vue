<script setup lang="ts">
import { computed, ref } from 'vue'
import { initials } from '@/utils/format'

/**
 * AkAvatar — person or entity image with initials fallback and optional
 * presence badge. Initial colours are derived from the name so a person
 * always gets the same colour.
 */
const props = withDefaults(
  defineProps<{
    name: string
    src?: string
    size?: 20 | 24 | 28 | 32 | 36 | 40 | 48 | 56 | 64 | 72 | 96
    shape?: 'circular' | 'square'
    presence?: 'available' | 'away' | 'busy' | 'offline'
    /** Decorative avatars next to a visible name should be hidden from AT. */
    decorative?: boolean
  }>(),
  { size: 32, shape: 'circular' },
)
const failed = ref(false)
const palette = [
  'bg-[color-mix(in_oklab,var(--ak-color-data-1)_18%,var(--ak-color-surface))] text-[color-mix(in_oklab,var(--ak-color-data-1)_45%,var(--ak-color-text-primary))]',
  'bg-[color-mix(in_oklab,var(--ak-color-data-2)_18%,var(--ak-color-surface))] text-[color-mix(in_oklab,var(--ak-color-data-2)_45%,var(--ak-color-text-primary))]',
  'bg-[color-mix(in_oklab,var(--ak-color-data-3)_18%,var(--ak-color-surface))] text-[color-mix(in_oklab,var(--ak-color-data-3)_45%,var(--ak-color-text-primary))]',
  'bg-[color-mix(in_oklab,var(--ak-color-data-4)_18%,var(--ak-color-surface))] text-[color-mix(in_oklab,var(--ak-color-data-4)_45%,var(--ak-color-text-primary))]',
  'bg-[color-mix(in_oklab,var(--ak-color-data-5)_18%,var(--ak-color-surface))] text-[color-mix(in_oklab,var(--ak-color-data-5)_45%,var(--ak-color-text-primary))]',
  'bg-[color-mix(in_oklab,var(--ak-color-data-6)_18%,var(--ak-color-surface))] text-[color-mix(in_oklab,var(--ak-color-data-6)_45%,var(--ak-color-text-primary))]',
]
const colorCls = computed(() => palette[[...props.name].reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length])
const fontSize = computed(() => (props.size <= 24 ? 'text-caption-2' : props.size <= 36 ? 'text-caption-1' : props.size <= 56 ? 'text-body-1' : 'text-title-3'))
const presenceCls = computed(
  () => ({ available: 'bg-success-strong', away: 'bg-warning-strong', busy: 'bg-danger-strong', offline: 'bg-surface border-2 border-fg-tertiary' })[props.presence ?? 'offline'],
)
const presenceLabel = computed(() => (props.presence ? `, ${props.presence}` : ''))
</script>

<template>
  <span
    class="relative inline-flex shrink-0 select-none"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : `${name}${presenceLabel}`"
    :aria-hidden="decorative ? 'true' : undefined"
  >
    <img
      v-if="src && !failed"
      :src="src"
      alt=""
      class="size-full object-cover"
      :class="shape === 'circular' ? 'rounded-full' : 'rounded-md'"
      @error="failed = true"
    />
    <span
      v-else
      class="flex size-full items-center justify-center font-semibold"
      :class="[colorCls, fontSize, shape === 'circular' ? 'rounded-full' : 'rounded-md']"
      aria-hidden="true"
    >
      {{ initials(name) }}
    </span>
    <span
      v-if="presence"
      class="absolute right-0 bottom-0 rounded-full ring-2 ring-surface"
      :class="[presenceCls, size >= 48 ? 'size-3.5' : 'size-2.5']"
      aria-hidden="true"
    />
  </span>
</template>
