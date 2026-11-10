<script setup lang="ts">
/** Page title block for documentation pages. */
defineProps<{ eyebrow?: string; title: string; lead?: string }>()
</script>

<template>
  <header class="mb-8">
    <p v-if="eyebrow" class="text-caption-1-strong tracking-wide text-brand uppercase">{{ eyebrow }}</p>
    <h1 class="mt-1 text-title-1 text-primary">{{ title }}</h1>
    <p v-if="lead" class="mt-3 max-w-3xl text-body-2 text-secondary">{{ lead }}</p>
    <slot />
  </header>
</template>
