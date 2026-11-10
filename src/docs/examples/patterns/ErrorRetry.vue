<script setup lang="ts">
import { ref } from 'vue'
import { RefreshCw } from '@lucide/vue'
import { AkButton, AkEmptyState, AkSkeleton, AkStatCard } from '@/design-system'

type State = 'loading' | 'error' | 'ready'
const state = ref<State>('error')
let attempts = 0

function load() {
  state.value = 'loading'
  attempts++
  // The first retry fails again; the second succeeds, to show both paths.
  setTimeout(() => (state.value = attempts % 2 === 1 ? 'error' : 'ready'), 900)
}
</script>

<template>
  <div class="max-w-sm rounded-card border border-line-subtle bg-surface p-4" :aria-busy="state === 'loading' ? 'true' : 'false'">
    <AkSkeleton v-if="state === 'loading'" :lines="3" />
    <AkEmptyState v-else-if="state === 'error'" variant="error" size="sm" title="Couldn’t load revenue" description="The server took too long to respond. Your data is safe.">
      <AkButton size="sm" :icon="RefreshCw" @click="load">Try again</AkButton>
    </AkEmptyState>
    <AkStatCard v-else label="Monthly revenue" value="$296,000" :delta="6.1" />
  </div>
</template>
