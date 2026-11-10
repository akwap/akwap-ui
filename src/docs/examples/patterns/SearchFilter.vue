<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search } from '@lucide/vue'
import { AkButton, AkDataTable, AkEmptyState, AkInput, AkMultiSelect, AkStatusIndicator, type Column } from '@/design-system'
import { users } from '@/services/mockData'

const q = ref('')
const roles = ref<(string | number)[]>([])
const rows = computed(() =>
  users.filter((u) => {
    const text = `${u.name} ${u.email} ${u.department}`.toLowerCase()
    return (!q.value || text.includes(q.value.trim().toLowerCase())) && (!roles.value.length || roles.value.includes(u.role))
  }),
)
const columns: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status', hideBelow: 'sm' },
]
function reset() {
  q.value = ''
  roles.value = []
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-2 sm:flex-row">
      <AkInput v-model="q" type="search" :leading-icon="Search" clearable placeholder="Search name, email or team" aria-label="Search members" class="sm:max-w-xs" />
      <AkMultiSelect v-model="roles" placeholder="All roles" aria-label="Filter by role" class="sm:max-w-xs" :options="['Owner', 'Admin', 'Manager', 'Analyst', 'Member'].map((r) => ({ label: r, value: r }))" />
      <AkButton v-if="q || roles.length" variant="subtle" @click="reset">Clear filters</AkButton>
    </div>
    <p class="text-caption-1 text-secondary" role="status">{{ rows.length }} of {{ users.length }} members</p>
    <AkDataTable v-if="rows.length" :columns="columns" :rows="rows.slice(0, 6)" caption="Filtered members" hide-caption min-width="0">
      <template #cell-status="{ row }"><AkStatusIndicator :status="row.status" /></template>
    </AkDataTable>
    <AkEmptyState v-else variant="search" size="sm" :title="`No members match “${q}”`" description="Check the spelling or clear the filters.">
      <AkButton size="sm" @click="reset">Clear filters</AkButton>
    </AkEmptyState>
  </div>
</template>
