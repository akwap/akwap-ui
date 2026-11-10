<script setup lang="ts">
import { ref } from 'vue'
import { Bold } from '@lucide/vue'
import { AkButton } from '@/design-system'

const bold = ref(false)
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <AkButton variant="primary">Rest — hover or press me</AkButton>
    <AkButton variant="primary" disabled>Disabled</AkButton>
    <AkButton variant="primary" loading>Saving</AkButton>
    <AkButton :icon="Bold" :pressed="bold" @click="bold = !bold">
      {{ bold ? 'Bold on' : 'Bold off' }}
    </AkButton>
  </div>
  <p class="mt-3 text-caption-1 text-secondary">Tab to any button to see the focus ring. The last button is a toggle (aria-pressed).</p>
</template>
