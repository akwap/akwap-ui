<script setup lang="ts">
import { AkSwitch } from '@/design-system'
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <AkSwitch :model-value="true" label="Medium (default)" />
    <AkSwitch :model-value="true" size="lg" label="Large" />
    <AkSwitch :model-value="false" label-position="before" label="Label before" />
    <AkSwitch :model-value="true" disabled label="Disabled on" />
    <AkSwitch :model-value="false" disabled label="Disabled off" />
  </div>
</template>
