<script setup lang="ts">
import { AkCard } from '@/design-system'
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-3">
    <AkCard padding="sm" title="Small">12px padding</AkCard>
    <AkCard padding="md" title="Medium">20px padding (default)</AkCard>
    <AkCard padding="lg" title="Large">24–32px padding</AkCard>
  </div>
</template>
