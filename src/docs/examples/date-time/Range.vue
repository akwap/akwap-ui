<script setup lang="ts">
import { ref } from 'vue'
import { AkDateRangePicker, AkField } from '@/design-system'

const range = ref<[string | null, string | null]>(['2026-10-12', '2026-11-10'])
</script>

<template>
  <AkField label="Reporting period" class="max-w-sm">
    <AkDateRangePicker v-model="range" today="2026-11-10" />
  </AkField>
  <p class="mt-3 text-caption-1 text-secondary">{{ range[0] }} → {{ range[1] }}</p>
</template>
