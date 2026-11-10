<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Download, X, LogIn, Plus, Pencil, Trash2, FileDown, Settings } from '@lucide/vue'
import { AkBadge, AkButton, AkDataTable, AkDatePicker, AkInput, AkPagination, AkSelect, useToast, type Column, type SortState, AkDrawer, AkDescriptionList } from '@/design-system'
import PageHeader from '@/components/layout/PageHeader.vue'
import { activityLogs, TODAY } from '@/services/mockData'
import { formatDateTime } from '@/utils/format'
import { downloadCsv } from '@/utils/csv'
import type { ActivityLog } from '@/types'

const toast = useToast()
const search = ref('')
const type = ref<'all' | ActivityLog['type']>('all')
const user = ref('all')
const from = ref<string | null>(null)
const page = ref(1)
const pageSize = ref(10)
const sort = ref<SortState | null>({ key: 'time', direction: 'desc' })
const detail = ref<ActivityLog | null>(null)
const detailOpen = computed({ get: () => !!detail.value, set: (v) => !v && (detail.value = null) })

const typeMeta: Record<ActivityLog['type'], { label: string; color: 'brand' | 'success' | 'info' | 'danger' | 'warning' | 'neutral'; icon: typeof LogIn }> = {
  auth: { label: 'Authentication', color: 'brand', icon: LogIn },
  create: { label: 'Create', color: 'success', icon: Plus },
  update: { label: 'Update', color: 'info', icon: Pencil },
  delete: { label: 'Delete', color: 'danger', icon: Trash2 },
  export: { label: 'Export', color: 'neutral', icon: FileDown },
  settings: { label: 'Settings', color: 'warning', icon: Settings },
}
const users = [...new Set(activityLogs.map((l) => l.user))].sort()
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return activityLogs.filter(
    (l) =>
      (!q || `${l.user} ${l.action} ${l.target} ${l.ip}`.toLowerCase().includes(q)) &&
      (type.value === 'all' || l.type === type.value) &&
      (user.value === 'all' || l.user === user.value) &&
      (!from.value || l.time.slice(0, 10) >= from.value),
  )
})
watch([search, type, user, from], () => (page.value = 1))
const rows = computed(() => {
  let r = filtered.value
  if (sort.value) {
    const { key, direction } = sort.value
    r = [...r].sort((a, b) => String(a[key as keyof ActivityLog]).localeCompare(String(b[key as keyof ActivityLog])) * (direction === 'asc' ? 1 : -1))
  }
  return r.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
})
const hasFilters = computed(() => !!search.value || type.value !== 'all' || user.value !== 'all' || !!from.value)
function clear() {
  search.value = ''
  type.value = 'all'
  user.value = 'all'
  from.value = null
}
const columns: Column<ActivityLog>[] = [
  { key: 'time', label: 'Date & time', sortable: true },
  { key: 'user', label: 'User', sortable: true },
  { key: 'action', label: 'Action', sortable: true },
  { key: 'type', label: 'Type', hideBelow: 'md' },
  { key: 'ip', label: 'IP address', hideBelow: 'lg' },
  { key: 'device', label: 'Device', hideBelow: 'xl' },
]
function exportLogs() {
  downloadCsv('akwap-activity.csv', filtered.value.map(({ id, time, user, email, action, target, type, ip, device }) => ({ id, time, user, email, action, target, type, ip, device })))
  toast.success('Export downloaded', `${filtered.value.length} entries`)
}
</script>

<template>
  <div>
    <PageHeader title="Activity logs" description="An immutable record of sign-ins and changes in your workspace. Retained for 365 days.">
      <template #actions><AkButton :icon="Download" @click="exportLogs">Export CSV</AkButton></template>
    </PageHeader>

    <div class="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto]">
      <AkInput v-model="search" type="search" placeholder="Search user, action, target or IP" aria-label="Search activity" class="sm:col-span-2 lg:col-span-1" />
      <AkSelect v-model="type" aria-label="Activity type" :options="[{ label: 'All types', value: 'all' }, ...Object.entries(typeMeta).map(([value, m]) => ({ label: m.label, value }))]" />
      <AkSelect v-model="user" aria-label="User" :options="[{ label: 'All users', value: 'all' }, ...users.map((u) => ({ label: u, value: u }))]" />
      <AkDatePicker v-model="from" :max="TODAY" :today="TODAY" placeholder="From date" aria-label="From date" />
      <AkButton v-if="hasFilters" variant="subtle" :icon="X" @click="clear">Clear</AkButton>
    </div>
    <p class="mb-2 text-caption-1 text-secondary" aria-live="polite">{{ filtered.length }} entries</p>

    <AkDataTable v-model:sort="sort" :columns="columns" :rows="rows" caption="Activity log" hide-caption manual-sort density="compact" row-clickable min-width="560px" @row-click="(r) => (detail = r)">
      <template #cell-time="{ row }"><time :datetime="row.time" class="whitespace-nowrap text-secondary tabular-nums">{{ formatDateTime(row.time) }}</time></template>
      <template #cell-user="{ row }"><span class="block font-semibold">{{ row.user }}</span><span class="block text-caption-1 text-tertiary">{{ row.email }}</span></template>
      <template #cell-action="{ row }">
        <span :class="row.action.startsWith('Failed') && 'text-danger'">{{ row.action }}</span>
        <span class="block text-caption-1 text-tertiary">{{ row.target }}</span>
      </template>
      <template #cell-type="{ row }"><AkBadge :color="typeMeta[row.type as ActivityLog['type']].color" :icon="typeMeta[row.type as ActivityLog['type']].icon">{{ typeMeta[row.type as ActivityLog['type']].label }}</AkBadge></template>
      <template #cell-ip="{ row }"><code class="font-mono text-caption-1">{{ row.ip }}</code></template>
    </AkDataTable>
    <AkPagination v-model:page="page" v-model:page-size="pageSize" :total="filtered.length" class="mt-4" label="Activity pagination" />

    <AkDrawer v-model:open="detailOpen" title="Log entry" size="md">
      <div v-if="detail" class="p-5">
        <AkDescriptionList
          layout="stacked"
          dividers
          :items="[
            { term: 'Event ID', description: `EVT-${detail.id}` },
            { term: 'Date & time', description: formatDateTime(detail.time) },
            { term: 'User', description: `${detail.user} (${detail.email})` },
            { term: 'Action', description: detail.action },
            { term: 'Target', description: detail.target },
            { term: 'Type', description: typeMeta[detail.type].label },
            { term: 'IP address', description: detail.ip },
            { term: 'Device', description: detail.device },
          ]"
        />
      </div>
    </AkDrawer>
  </div>
</template>
