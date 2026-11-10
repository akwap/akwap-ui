<script setup lang="ts">
import { ref } from 'vue'
import { SlidersHorizontal } from '@lucide/vue'
import { AkButton, AkCheckbox, AkPopover } from '@/design-system'

const cols = ref(['name', 'role', 'status'])
</script>

<template>
  <AkPopover label="Visible columns" width="240px">
    <template #trigger="{ attrs }">
      <AkButton :icon="SlidersHorizontal" v-bind="attrs">Columns ({{ cols.length }})</AkButton>
    </template>
    <template #default="{ close }">
      <fieldset class="flex flex-col gap-2">
        <legend class="mb-1 text-body-1-strong text-primary">Visible columns</legend>
        <AkCheckbox v-for="c in ['name', 'email', 'role', 'status', 'last active']" :key="c" v-model="cols" :value="c" :label="c[0]!.toUpperCase() + c.slice(1)" />
      </fieldset>
      <AkButton class="mt-3" size="sm" variant="primary" block @click="close()">Done</AkButton>
    </template>
  </AkPopover>
</template>
