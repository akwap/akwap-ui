<script setup lang="ts">
import { Rocket } from '@lucide/vue'
import { AkIcon } from '@/design-system'
</script>

<template>
  <div class="flex flex-wrap items-center gap-6 text-primary">
    <AkIcon name="add" />
    <AkIcon name="edit" />
    <AkIcon name="delete" />
    <AkIcon name="download" />
    <AkIcon name="settings" />
    <!-- Any Lucide icon that has no semantic name -->
    <AkIcon :icon="Rocket" />
  </div>
</template>
