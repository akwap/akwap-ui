<script setup lang="ts">
import { AkSpinner } from '@/design-system'
</script>

<template>
  <div class="flex flex-wrap items-end gap-6">
    <AkSpinner v-for="s in ['xs', 'sm', 'md', 'lg', 'xl'] as const" :key="s" :size="s" :label="s" label-position="below" />
    <div class="rounded-md bg-brand p-3"><AkSpinner appearance="inverted" label="On brand" /></div>
  </div>
</template>
