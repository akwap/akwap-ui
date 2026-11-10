<script setup lang="ts">
import { AkCheckbox } from '@/design-system'
</script>

<template>
  <div class="flex flex-wrap gap-6">
    <AkCheckbox :model-value="true" label="Medium (16px)" />
    <AkCheckbox :model-value="true" size="lg" label="Large (20px)" />
    <AkCheckbox :model-value="true" shape="circular" label="Circular" />
    <AkCheckbox :model-value="true" label-position="before" label="Label before" />
  </div>
</template>
