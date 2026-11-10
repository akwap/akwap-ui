<script setup lang="ts">
import { assertiveMessage, politeMessage } from '@/composables/useAnnouncer'
</script>

<template>
  <div class="sr-only" aria-live="polite" aria-atomic="true">{{ politeMessage }}</div>
  <div class="sr-only" aria-live="assertive" aria-atomic="true">{{ assertiveMessage }}</div>
</template>
