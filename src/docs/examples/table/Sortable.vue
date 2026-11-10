<script setup lang="ts">
import { ref } from 'vue'
import { AkAvatar, AkDataTable, AkStatusIndicator, type Column, type SortState } from '@/design-system'
import { users } from '@/services/mockData'

const rows = users.slice(0, 8)
const sort = ref<SortState | null>({ key: 'name', direction: 'asc' })
const selected = ref<Array<string | number>>([])
const columns: Column<(typeof rows)[number]>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true, hideBelow: 'sm' },
  { key: 'department', label: 'Department', hideBelow: 'md' },
  { key: 'status', label: 'Status', sortable: true },
]
</script>

<template>
  <p class="mb-3 text-caption-1 text-secondary" aria-live="polite">{{ selected.length }} selected</p>
  <AkDataTable v-model:sort="sort" v-model:selected="selected" :columns="columns" :rows="rows" caption="Team members" selectable min-width="0">
    <template #cell-name="{ row }">
      <span class="flex items-center gap-2">
        <AkAvatar :name="row.name" :size="24" decorative />
        <span class="min-w-0">
          <span class="block truncate text-primary">{{ row.name }}</span>
          <span class="block truncate text-caption-1 text-tertiary">{{ row.email }}</span>
        </span>
      </span>
    </template>
    <template #cell-status="{ row }"><AkStatusIndicator :status="row.status" /></template>
  </AkDataTable>
</template>
