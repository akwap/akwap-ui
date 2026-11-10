<script setup lang="ts">
import { AkStatusIndicator } from '@/design-system'
const statuses = ['active', 'pending', 'inactive', 'suspended', 'error', 'online', 'away', 'busy', 'offline'] as const
</script>

<template>
  <ul class="grid gap-3 sm:grid-cols-3">
    <li v-for="s in statuses" :key="s"><AkStatusIndicator :status="s" /></li>
  </ul>
</template>
