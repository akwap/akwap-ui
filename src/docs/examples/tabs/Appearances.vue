<script setup lang="ts">
import { ref } from 'vue'
import { User, Shield, Bell } from '@lucide/vue'
import { AkTabs } from '@/design-system'

const a = ref('profile')
const b = ref('profile')
const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'alerts', label: 'Alerts', icon: Bell },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <AkTabs v-model="a" :tabs="tabs" appearance="subtle" size="sm" label="Subtle tabs">
      <template #panel="{ tab }"><p class="pt-3 text-body-1 text-secondary">Subtle, small: {{ tab.label }}</p></template>
    </AkTabs>
    <AkTabs v-model="b" :tabs="tabs" orientation="vertical" label="Vertical tabs">
      <template #panel="{ tab }"><p class="text-body-1 text-secondary">Vertical tabs use ↑ and ↓. Showing {{ tab.label }}.</p></template>
    </AkTabs>
  </div>
</template>
