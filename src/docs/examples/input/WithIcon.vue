<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Search } from '@lucide/vue'
import { AkField, AkInput } from '@/design-system'

const q = ref('')
const email = ref('')
</script>

<template>
  <div class="flex max-w-sm flex-col gap-4">
    <AkField label="Search members" hide-label>
      <AkInput v-model="q" type="search" :leading-icon="Search" clearable placeholder="Search members" />
    </AkField>
    <AkField label="Work email"><AkInput v-model="email" type="email" :leading-icon="Mail" placeholder="name@company.com" /></AkField>
    <p class="text-caption-1 text-secondary">Query: “{{ q }}”</p>
  </div>
</template>
