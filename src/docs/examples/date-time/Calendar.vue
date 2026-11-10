<script setup lang="ts">
import { ref } from 'vue'
import { AkCalendar } from '@/design-system'

const day = ref<string | null>('2026-11-12')
const isWeekend = (iso: string) => [0, 6].includes(new Date(`${iso}T00:00:00`).getDay())
</script>

<template>
  <div class="inline-block rounded-card border border-line-subtle bg-surface p-3">
    <AkCalendar v-model="day" today="2026-11-10" :is-disabled="isWeekend" />
  </div>
  <p class="mt-3 text-caption-1 text-secondary">Weekends are disabled. Selected: {{ day }}</p>
</template>
