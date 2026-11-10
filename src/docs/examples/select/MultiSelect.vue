<script setup lang="ts">
import { ref } from 'vue'
import { AkField, AkMultiSelect } from '@/design-system'

const roles = ref<(string | number)[]>(['admin', 'analyst'])
</script>

<template>
  <AkField label="Filter by role" helper="Type to search. Chips collapse into +N after three." class="max-w-md">
    <AkMultiSelect
      v-model="roles"
      :options="[
        { label: 'Owner', value: 'owner' },
        { label: 'Admin', value: 'admin', description: 'Manage members and settings' },
        { label: 'Manager', value: 'manager' },
        { label: 'Analyst', value: 'analyst', description: 'Read-only access to reports' },
        { label: 'Member', value: 'member' },
        { label: 'Guest', value: 'guest', disabled: true },
      ]"
    />
  </AkField>
  <p class="mt-2 text-caption-1 text-secondary">Selected: {{ roles.join(', ') || 'none' }}</p>
</template>
