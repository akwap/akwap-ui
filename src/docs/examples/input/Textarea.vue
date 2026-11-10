<script setup lang="ts">
import { ref } from 'vue'
import { AkField, AkTextarea } from '@/design-system'

const bio = ref('Product designer based in Nairobi.')
</script>

<template>
  <AkField label="Bio" :helper="`${bio.length}/200 characters. Grows as you type.`" class="max-w-lg">
    <AkTextarea v-model="bio" :maxlength="200" auto-resize :max-rows="6" />
  </AkField>
</template>
