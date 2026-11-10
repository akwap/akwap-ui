<script setup lang="ts">
import { ref } from 'vue'
import { AkField, AkInput } from '@/design-system'

const email = ref('amina@akwap')
const username = ref('amina.okafor')
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <AkField label="Rest / focus"><AkInput placeholder="Click or tab into me" /></AkField>
    <AkField label="Disabled" disabled><AkInput model-value="Not editable" disabled /></AkField>
    <AkField label="Read-only" helper="Selectable and focusable, not editable."><AkInput model-value="ACC-20931" readonly /></AkField>
    <AkField label="Error" :error="email.includes('.') ? null : 'Enter a valid email address, like name@company.com'">
      <AkInput v-model="email" type="email" />
    </AkField>
    <AkField label="Success" success="This username is available."><AkInput v-model="username" success /></AkField>
    <AkField label="Required" required helper="Required fields are marked with an asterisk."><AkInput /></AkField>
  </div>
</template>
