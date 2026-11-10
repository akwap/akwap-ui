<script setup lang="ts">
import { ShieldCheck } from '@lucide/vue'
import { AkBadge } from '@/design-system'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <AkBadge size="sm">Small</AkBadge>
    <AkBadge size="md">Medium</AkBadge>
    <AkBadge size="lg">Large</AkBadge>
    <AkBadge color="success" dot>Online</AkBadge>
    <AkBadge color="brand" :icon="ShieldCheck">Verified</AkBadge>
    <AkBadge color="danger" appearance="filled" shape="rounded">3 failed</AkBadge>
  </div>
</template>
