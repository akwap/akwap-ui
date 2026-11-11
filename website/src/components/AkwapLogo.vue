<script setup lang="ts">
import AkwapMark from './AkwapMark.vue'

/** Full lockup: globe-star mark + AKWAP / SYSTEMS wordmark. */
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg'; animated?: boolean }>(), { size: 'md', animated: false })
</script>

<template>
  <span class="inline-flex items-center gap-2.5 text-primary">
    <AkwapMark :size="{ sm: 28, md: 36, lg: 52 }[size]" :animated="animated" />
    <span class="flex flex-col leading-none">
      <span class="font-bold tracking-[0.18em]" :class="{ sm: 'text-body-1', md: 'text-subtitle-2', lg: 'text-title-3' }[size]">AKWAP</span>
      <span class="mt-1 font-semibold tracking-[0.42em] text-[color:var(--site-sun)]" :class="{ sm: 'text-[9px]', md: 'text-[10px]', lg: 'text-caption-1' }[size]">SYSTEMS</span>
    </span>
  </span>
</template>
