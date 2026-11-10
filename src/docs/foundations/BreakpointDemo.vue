<script setup lang="ts">
import { computed } from 'vue'
import { useMediaQuery } from '@/composables/useMediaQuery'

/** Shows the active breakpoint and a 12-column grid that reflows. */
const bps = [
  ['xs', 425], ['sm', 640], ['md', 768], ['lg', 1024], ['xl', 1280], ['2xl', 1440], ['3xl', 1920],
] as const
const matches = bps.map(([n, px]) => [n, useMediaQuery(`(min-width: ${px}px)`)] as const)
const active = computed(() => [...matches].reverse().find(([, m]) => m.value)?.[0] ?? 'base (<425px)')
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-body-1 text-secondary" aria-live="polite">
      Active breakpoint: <strong class="text-primary">{{ active }}</strong>. Resize the window to see it change.
    </p>
    <div class="grid grid-cols-4 gap-2 md:grid-cols-8 lg:grid-cols-12" aria-hidden="true">
      <span v-for="n in 12" :key="n" class="flex h-10 items-center justify-center rounded-sm bg-brand-subtle text-caption-1 text-brand" :class="[n > 4 && 'max-md:hidden', n > 8 && 'max-lg:hidden']">{{ n }}</span>
    </div>
    <p class="text-caption-1 text-tertiary">4 columns on phones, 8 on tablets, 12 from 1024px. Gutters are 8px here; layouts use 16–24px.</p>
  </div>
</template>
