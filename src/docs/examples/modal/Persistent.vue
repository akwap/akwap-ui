<script setup lang="ts">
import { ref } from 'vue'
import { AkButton, AkDialog, AkProgressBar } from '@/design-system'

const open = ref(false)
const progress = ref(0)

function start() {
  open.value = true
  progress.value = 0
  const t = setInterval(() => {
    progress.value += 20
    if (progress.value >= 100) {
      clearInterval(t)
      setTimeout(() => (open.value = false), 400)
    }
  }, 400)
}
</script>

<template>
  <AkButton @click="start">Run export</AkButton>
  <AkDialog v-model:open="open" title="Exporting data" persistent hide-close size="sm">
    <AkProgressBar :value="progress" label="Preparing CSV" show-value />
    <p class="mt-3 text-caption-1 text-secondary">Persistent dialogs ignore Esc and backdrop clicks. Use only for short, blocking work.</p>
  </AkDialog>
</template>
