<script setup lang="ts">
import { ref } from 'vue'
import { AkAlert, AkButton } from '@/design-system'

const visible = ref(true)
</script>

<template>
  <div class="flex flex-col gap-3">
    <AkAlert v-if="visible" intent="warning" title="Your trial ends in 3 days" dismissible role="none" @dismiss="visible = false">
      Upgrade to keep reports and integrations.
      <template #actions>
        <AkButton size="sm" variant="primary" to="/#pricing">See plans</AkButton>
        <AkButton size="sm" variant="subtle" @click="visible = false">Remind me later</AkButton>
      </template>
    </AkAlert>
    <AkButton v-else @click="visible = true">Show alert again</AkButton>
    <AkAlert intent="info" layout="inline" title="New:" role="none">Export reports to CSV from the Analytics page.</AkAlert>
  </div>
</template>
