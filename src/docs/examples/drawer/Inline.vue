<script setup lang="ts">
import { ref } from 'vue'
import { PanelRight } from '@lucide/vue'
import { AkButton, AkDescriptionList, AkDrawer } from '@/design-system'

const open = ref(true)
</script>

<template>
  <div class="flex h-72 overflow-hidden rounded-card border border-line-subtle">
    <div class="min-w-0 flex-1 p-4">
      <AkButton :icon="PanelRight" :pressed="open" @click="open = !open">Details panel</AkButton>
      <p class="mt-3 text-body-1 text-secondary">Inline drawers push content instead of covering it, and do not trap focus.</p>
    </div>
    <AkDrawer v-model:open="open" type="inline" title="Invoice INV-2041" size="sm">
      <AkDescriptionList layout="stacked" :items="[{ term: 'Customer', description: 'Zawadi Njeri' }, { term: 'Amount', description: '$1,240.00' }, { term: 'Status', description: 'Paid' }]" />
    </AkDrawer>
  </div>
</template>
