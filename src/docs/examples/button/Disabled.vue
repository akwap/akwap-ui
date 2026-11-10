<script setup lang="ts">
import { ref } from 'vue'
import { AkButton, AkCheckbox } from '@/design-system'

const agreed = ref(false)
</script>

<template>
  <div class="flex max-w-md flex-col items-start gap-3">
    <AkCheckbox v-model="agreed" label="I agree to the terms of service" />
    <AkButton variant="primary" :disabled="!agreed">Create account</AkButton>
    <p class="text-caption-1 text-secondary">
      The button stays disabled until the box is ticked. Prefer explaining why an action is unavailable over silently disabling it.
    </p>
  </div>
</template>
