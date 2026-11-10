<script setup lang="ts">
import { ref } from 'vue'
import { AkTabs } from '@/design-system'

const tab = ref('overview')
</script>

<template>
  <AkTabs
    v-model="tab"
    label="Project"
    :tabs="[
      { id: 'overview', label: 'Overview' },
      { id: 'activity', label: 'Activity', badge: 4 },
      { id: 'settings', label: 'Settings' },
      { id: 'billing', label: 'Billing', disabled: true },
    ]"
  >
    <template #overview><p class="pt-4 text-body-1 text-secondary">Project summary, owners and key dates.</p></template>
    <template #activity><p class="pt-4 text-body-1 text-secondary">Four new events since your last visit.</p></template>
    <template #settings><p class="pt-4 text-body-1 text-secondary">Name, visibility and integrations.</p></template>
  </AkTabs>
</template>
