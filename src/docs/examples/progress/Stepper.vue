<script setup lang="ts">
import { ref } from 'vue'
import { AkButton, AkStepper } from '@/design-system'

const current = ref(1)
const steps = [
  { id: 'account', label: 'Account', description: 'Email and password' },
  { id: 'workspace', label: 'Workspace', description: 'Name and region' },
  { id: 'team', label: 'Invite team' },
  { id: 'done', label: 'Done' },
]
</script>

<template>
  <AkStepper :steps="steps" :current="current" label="Onboarding progress" />
  <div class="mt-6 flex gap-2">
    <AkButton :disabled="current === 0" @click="current--">Back</AkButton>
    <AkButton variant="primary" :disabled="current === steps.length - 1" @click="current++">Next</AkButton>
  </div>
</template>
