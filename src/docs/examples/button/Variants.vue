<script setup lang="ts">
import { AkButton } from '@/design-system'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <AkButton variant="primary">Primary</AkButton>
    <AkButton>Secondary</AkButton>
    <AkButton variant="outline">Outline</AkButton>
    <AkButton variant="subtle">Subtle</AkButton>
    <AkButton variant="transparent">Transparent</AkButton>
    <AkButton variant="danger">Danger</AkButton>
    <AkButton variant="link">Link</AkButton>
  </div>
</template>
