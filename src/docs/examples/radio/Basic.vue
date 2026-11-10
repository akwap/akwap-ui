<script setup lang="ts">
import { ref } from 'vue'
import { AkRadioGroup } from '@/design-system'

const plan = ref('team')
</script>

<template>
  <AkRadioGroup
    v-model="plan"
    label="Plan"
    helper="You can change plans at any time."
    :options="[
      { label: 'Starter', value: 'starter', description: 'Up to 5 members' },
      { label: 'Team', value: 'team', description: 'Up to 50 members, SSO' },
      { label: 'Enterprise', value: 'enterprise', description: 'Contact sales', disabled: true },
    ]"
  />
  <p class="mt-3 text-caption-1 text-secondary">Selected plan: {{ plan }}</p>
</template>
