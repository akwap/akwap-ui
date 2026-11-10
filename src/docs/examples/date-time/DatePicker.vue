<script setup lang="ts">
import { ref } from 'vue'
import { AkDatePicker, AkField, AkTimePicker } from '@/design-system'

const date = ref<string | null>('2026-11-14')
const time = ref<string | null>('09:30')
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <AkField label="Meeting date" helper="Weekdays from today onward.">
      <AkDatePicker v-model="date" today="2026-11-10" min="2026-11-10" />
    </AkField>
    <AkField label="Start time">
      <AkTimePicker v-model="time" :step="15" min="08:00" max="18:00" />
    </AkField>
  </div>
  <p class="mt-3 text-caption-1 text-secondary">Value: {{ date ?? '—' }} at {{ time ?? '—' }}</p>
</template>
