<script setup lang="ts">
import { AkCard } from '@/design-system'
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <AkCard title="Outline" subtitle="Default. Sits on the page background.">Use for most grouped content.</AkCard>
    <AkCard appearance="filled" title="Filled" subtitle="Secondary surface.">Use inside other surfaces.</AkCard>
    <AkCard appearance="subtle" title="Subtle" subtitle="No border, no fill.">Use for low-emphasis groups.</AkCard>
    <AkCard appearance="elevated" title="Elevated" subtitle="Shadow 4.">Use sparingly to lift one item.</AkCard>
  </div>
</template>
