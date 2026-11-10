<script setup lang="ts">
/** Product wordmark. The mark uses brand tokens so it follows rebranding. */
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg'; showText?: boolean; text?: string }>(), { size: 'md', showText: true, text: 'Akwap' })
</script>

<template>
  <span class="inline-flex items-center gap-2 text-primary">
    <svg
      :class="{ sm: 'size-6', md: 'size-7', lg: 'size-9' }[size]"
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill="var(--ak-color-brand-primary)" />
      <path d="M9 23 15 9h2l6 14h-3.2l-1.4-3.4h-4.9L12.1 23Zm5.4-6.1h3.2L16 13Z" fill="var(--ak-color-on-brand)" />
    </svg>
    <span v-if="showText" class="font-semibold tracking-tight" :class="{ sm: 'text-body-1', md: 'text-subtitle-2', lg: 'text-subtitle-1' }[size]">{{ text }}</span>
  </span>
</template>
