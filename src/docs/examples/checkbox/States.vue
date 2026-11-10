<script setup lang="ts">
import { AkCheckbox } from '@/design-system'
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2">
    <AkCheckbox label="Unchecked" />
    <AkCheckbox :model-value="true" label="Checked" />
    <AkCheckbox indeterminate label="Indeterminate" />
    <AkCheckbox disabled label="Disabled" />
    <AkCheckbox :model-value="true" disabled label="Disabled checked" />
    <AkCheckbox invalid required label="Invalid (required)" />
  </div>
</template>
