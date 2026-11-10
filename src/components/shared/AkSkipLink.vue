<script setup lang="ts">
withDefaults(defineProps<{ target?: string }>(), { target: '#main' })
</script>

<template>
  <a
    :href="target"
    class="sr-only-focusable fixed top-2 left-2 z-[var(--ak-z-tooltip)] rounded-control bg-brand px-4 py-2 text-body-1-strong text-on-brand shadow-elevation-8 focus-ring"
  >
    Skip to main content
  </a>
</template>
