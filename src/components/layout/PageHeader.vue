<script setup lang="ts">
/** Standard page heading row used by every dashboard page. */
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div class="min-w-0">
      <h1 class="text-title-3 text-primary sm:text-title-2">{{ title }}</h1>
      <p v-if="description" class="mt-1 max-w-2xl text-body-1 text-secondary">{{ description }}</p>
      <slot name="meta" />
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2"><slot name="actions" /></div>
  </div>
</template>
