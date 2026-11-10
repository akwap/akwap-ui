<script setup lang="ts">
/** Label/description on the left, control on the right; stacks on mobile. */
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <div class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
    <div class="min-w-0">
      <p class="text-body-1-strong text-primary">{{ title }}</p>
      <p v-if="description" class="mt-0.5 text-caption-1 text-secondary">{{ description }}</p>
    </div>
    <div class="shrink-0"><slot /></div>
  </div>
</template>
