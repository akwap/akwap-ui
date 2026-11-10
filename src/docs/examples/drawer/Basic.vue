<script setup lang="ts">
import { ref } from 'vue'
import { Filter } from '@lucide/vue'
import { AkButton, AkCheckbox, AkDrawer, AkField, AkSelect } from '@/design-system'

const open = ref(false)
const side = ref<'right' | 'left' | 'bottom'>('right')
const statuses = ref<string[]>(['active'])
const role = ref('Any')
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <AkButton :icon="Filter" @click="(side = 'right'), (open = true)">Filters (right)</AkButton>
    <AkButton @click="(side = 'left'), (open = true)">Left</AkButton>
    <AkButton @click="(side = 'bottom'), (open = true)">Bottom sheet</AkButton>
  </div>
  <AkDrawer v-model:open="open" :side="side" title="Filter members" size="sm">
    <div class="flex flex-col gap-4">
      <fieldset class="flex flex-col gap-2">
        <legend class="mb-1 text-body-1-strong text-primary">Status</legend>
        <AkCheckbox v-model="statuses" value="active" label="Active" />
        <AkCheckbox v-model="statuses" value="pending" label="Pending" />
        <AkCheckbox v-model="statuses" value="suspended" label="Suspended" />
      </fieldset>
      <AkField label="Role"><AkSelect v-model="role" :options="['Any', 'Admin', 'Member']" /></AkField>
    </div>
    <template #footer="{ close }">
      <AkButton @click="(statuses = []), (role = 'Any')">Reset</AkButton>
      <AkButton variant="primary" @click="close">Apply</AkButton>
    </template>
  </AkDrawer>
</template>
