<script setup lang="ts">
import { AkDatePicker, AkTimePicker } from '@/design-system'
</script>

<template>
  <div class="flex max-w-xs flex-col gap-3">
    <AkDatePicker size="sm" model-value="2026-11-10" today="2026-11-10" aria-label="Small date picker" />
    <AkDatePicker model-value="2026-11-10" today="2026-11-10" aria-label="Medium date picker" />
    <AkTimePicker size="lg" model-value="14:00" aria-label="Large time picker" />
    <AkDatePicker disabled model-value="2026-11-10" aria-label="Disabled date picker" />
    <AkDatePicker invalid aria-label="Invalid date picker" />
  </div>
</template>
