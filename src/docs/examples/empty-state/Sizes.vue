<script setup lang="ts">
import { AkEmptyState } from '@/design-system'
</script>

<template>
  <div class="grid gap-4 md:grid-cols-3">
    <div v-for="s in ['sm', 'md', 'lg'] as const" :key="s" class="rounded-card border border-line-subtle bg-surface p-4">
      <AkEmptyState :size="s" :title="`Size ${s}`" description="No files in this folder." />
    </div>
  </div>
</template>
