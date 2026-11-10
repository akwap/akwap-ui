<script setup lang="ts">
import { ref } from 'vue'
import { AkSwitch } from '@/design-system'

const twoFactor = ref(true)
const marketing = ref(false)
</script>

<template>
  <div class="flex max-w-md flex-col gap-4">
    <AkSwitch v-model="twoFactor" label="Two-factor authentication" description="Require a code from your authenticator app when signing in." />
    <AkSwitch v-model="marketing" label="Product updates by email" />
    <p class="text-caption-1 text-secondary">2FA is {{ twoFactor ? 'on' : 'off' }} · Updates are {{ marketing ? 'on' : 'off' }}</p>
  </div>
</template>
