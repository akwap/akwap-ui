<script setup lang="ts">
import { ref } from 'vue'
import { AkField, AkSelect } from '@/design-system'

const role = ref('Member')
const tz = ref<string | number | null>(null)
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <AkField label="Role"><AkSelect v-model="role" :options="['Owner', 'Admin', 'Manager', 'Analyst', 'Member']" /></AkField>
    <AkField label="Time zone" helper="Uses the native picker on mobile.">
      <AkSelect
        v-model="tz"
        placeholder="Select a time zone"
        :options="[
          { label: 'Africa/Nairobi (EAT)', value: 'Africa/Nairobi' },
          { label: 'Africa/Lagos (WAT)', value: 'Africa/Lagos' },
          { label: 'Europe/London (GMT)', value: 'Europe/London', disabled: true },
        ]"
      />
    </AkField>
  </div>
</template>
