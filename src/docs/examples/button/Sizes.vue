<script setup lang="ts">
import { Plus } from '@lucide/vue'
import { AkButton } from '@/design-system'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-3">
      <AkButton variant="primary" size="sm">Small (24px)</AkButton>
      <AkButton variant="primary" size="md">Medium (32px)</AkButton>
      <AkButton variant="primary" size="lg">Large (40px)</AkButton>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <AkButton size="sm" icon-only :icon="Plus" aria-label="Add (small)" />
      <AkButton size="md" icon-only :icon="Plus" aria-label="Add (medium)" />
      <AkButton size="lg" icon-only :icon="Plus" aria-label="Add (large)" />
    </div>
    <AkButton variant="primary" block>Block button fills its container</AkButton>
  </div>
</template>
