<script setup lang="ts">
import { ref } from 'vue'
import { Send, AlignLeft, AlignCenter, AlignRight, List, LayoutGrid } from '@lucide/vue'
import { AkButton, AkButtonGroup, AkSegmentedControl, AkSplitButton, useToast } from '@/design-system'

const toast = useToast()
const view = ref<'list' | 'grid'>('list')
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <AkSplitButton
      :icon="Send"
      :items="[
        { label: 'Schedule send', onSelect: () => toast.info('Scheduled', 'Sending tomorrow at 9:00') },
        { label: 'Save as draft', onSelect: () => toast.info('Draft saved') },
      ]"
      @click="toast.success('Message sent')"
    >
      Send
    </AkSplitButton>

    <AkButtonGroup label="Text alignment">
      <AkButton icon-only :icon="AlignLeft" aria-label="Align left" />
      <AkButton icon-only :icon="AlignCenter" aria-label="Align center" />
      <AkButton icon-only :icon="AlignRight" aria-label="Align right" />
    </AkButtonGroup>

    <AkSegmentedControl
      v-model="view"
      label="View"
      :options="[
        { label: 'List', value: 'list', icon: List },
        { label: 'Grid', value: 'grid', icon: LayoutGrid },
      ]"
    />
    <p class="text-caption-1 text-secondary">Current view: {{ view }}</p>
  </div>
</template>
