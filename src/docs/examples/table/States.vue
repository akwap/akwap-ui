<script setup lang="ts">
import { ref } from 'vue'
import { AkButton, AkDataTable, AkSegmentedControl, type Column } from '@/design-system'
import { transactions } from '@/services/mockData'
import { formatCurrency } from '@/utils/format'

const state = ref<'data' | 'loading' | 'empty'>('loading')
const density = ref<'compact' | 'default' | 'comfortable'>('default')
const columns: Column[] = [
  { key: 'id', label: 'Invoice' },
  { key: 'customer', label: 'Customer' },
  { key: 'amount', label: 'Amount', align: 'end', format: (v: number) => formatCurrency(v) },
]
</script>

<template>
  <div class="mb-4 flex flex-wrap gap-3">
    <AkSegmentedControl v-model="state" label="Table state" size="sm" :options="[{ label: 'Data', value: 'data' }, { label: 'Loading', value: 'loading' }, { label: 'Empty', value: 'empty' }]" />
    <AkSegmentedControl v-model="density" label="Density" size="sm" :options="[{ label: 'Compact', value: 'compact' }, { label: 'Default', value: 'default' }, { label: 'Comfortable', value: 'comfortable' }]" />
  </div>
  <AkDataTable
    :columns="columns"
    :rows="state === 'data' ? transactions.slice(0, 4) : []"
    :loading="state === 'loading'"
    :density="density"
    caption="Recent invoices"
    min-width="420px"
    empty-title="No invoices yet"
    empty-description="Invoices appear here once a customer pays."
  >
    <template #empty>
      <AkButton size="sm" variant="primary" @click="state = 'data'">Load sample invoices</AkButton>
    </template>
  </AkDataTable>
</template>
