<script setup lang="ts">
import { ref } from 'vue'
import { AkRadio, AkRadioGroup } from '@/design-system'

const freq = ref<string | number | null>(null)
</script>

<template>
  <AkRadioGroup v-model="freq" label="Report frequency" orientation="horizontal" required :error="freq ? undefined : 'Choose how often to receive reports'">
    <AkRadio value="daily" label="Daily" />
    <AkRadio value="weekly" label="Weekly" />
    <AkRadio value="monthly" label="Monthly" />
  </AkRadioGroup>
</template>
