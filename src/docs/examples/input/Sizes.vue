<script setup lang="ts">
import { AkField, AkInput } from '@/design-system'
</script>

<template>
  <div class="flex max-w-sm flex-col gap-4">
    <AkField label="Small (24px)" size="sm"><AkInput size="sm" placeholder="Dense toolbars and tables" /></AkField>
    <AkField label="Medium (32px, default)"><AkInput placeholder="Most forms" /></AkField>
    <AkField label="Large (40px)" size="lg"><AkInput size="lg" placeholder="Sign-in and touch-first forms" /></AkField>
  </div>
</template>
