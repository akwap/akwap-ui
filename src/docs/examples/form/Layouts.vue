<script setup lang="ts">
import { ref } from 'vue'
import { AkField, AkInput, AkSelect } from '@/design-system'

const company = ref('Akwap Ltd')
const country = ref('KE')
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="grid gap-4 md:grid-cols-2">
      <AkField label="Company"><AkInput v-model="company" /></AkField>
      <AkField label="Country">
        <AkSelect v-model="country" :options="[{ label: 'Kenya', value: 'KE' }, { label: 'Nigeria', value: 'NG' }, { label: 'Ghana', value: 'GH' }]" />
      </AkField>
    </div>
    <AkField label="VAT number" orientation="horizontal" helper="Horizontal fields stack below 640px.">
      <AkInput placeholder="P051234567X" />
    </AkField>
  </div>
</template>
