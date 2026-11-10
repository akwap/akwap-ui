<script setup lang="ts">
import { AkSelect } from '@/design-system'
const opts = ['Weekly', 'Monthly', 'Quarterly']
</script>

<template>
  <div class="flex max-w-xs flex-col gap-3">
    <AkSelect size="sm" model-value="Weekly" :options="opts" aria-label="Small select" />
    <AkSelect model-value="Monthly" :options="opts" aria-label="Medium select" />
    <AkSelect size="lg" model-value="Quarterly" :options="opts" aria-label="Large select" />
  </div>
</template>
