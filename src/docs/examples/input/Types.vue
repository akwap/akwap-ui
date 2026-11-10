<script setup lang="ts">
import { ref } from 'vue'
import { AkField, AkInput } from '@/design-system'

const name = ref('Amina Okafor')
const email = ref('')
const password = ref('')
const seats = ref<number | string | null>(5)
const query = ref('quarterly report')
const phone = ref('')
const site = ref('')
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <AkField label="Full name"><AkInput v-model="name" autocomplete="name" /></AkField>
    <AkField label="Email" helper="We'll never share it."><AkInput v-model="email" type="email" placeholder="name@company.com" /></AkField>
    <AkField label="Password" helper="Use the eye button to show or hide it."><AkInput v-model="password" type="password" autocomplete="new-password" /></AkField>
    <AkField label="Seats"><AkInput v-model="seats" type="number" :min="1" :max="50" /></AkField>
    <AkField label="Search"><AkInput v-model="query" type="search" clearable placeholder="Search files" /></AkField>
    <AkField label="Phone" optional><AkInput v-model="phone" type="tel" placeholder="+254 712 345 678" /></AkField>
    <AkField label="Website" optional class="sm:col-span-2"><AkInput v-model="site" type="url" placeholder="https://" /></AkField>
  </div>
</template>
