<script setup lang="ts">
import { AkField, AkSelect } from '@/design-system'
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-3">
    <AkField label="Default"><AkSelect model-value="Design" :options="['Design', 'Engineering']" /></AkField>
    <AkField label="Disabled" disabled><AkSelect model-value="Design" :options="['Design', 'Engineering']" disabled /></AkField>
    <AkField label="Error" error="Choose a department"><AkSelect placeholder="Select…" :options="['Design', 'Engineering']" /></AkField>
  </div>
</template>
