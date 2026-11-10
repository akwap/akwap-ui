<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UserPlus, Download, MoreHorizontal, Pencil, Eye, Trash2, Ban, CircleCheck, X } from '@lucide/vue'
import {
  AkAvatar, AkBadge, AkButton, AkConfirmDialog, AkDataTable, AkDescriptionList, AkDialog, AkDrawer, AkField, AkInput, AkMenu,
  AkMultiSelect, AkPagination, AkSelect, AkStatusIndicator, useToast, type Column, type SortState,
} from '@/design-system'
import PageHeader from '@/components/layout/PageHeader.vue'
import { useUsers } from '@/stores/users'
import { useForm } from '@/composables/useForm'
import { rules } from '@/utils/validation'
import { formatDate, formatRelative } from '@/utils/format'
import { downloadCsv } from '@/utils/csv'
import { useAnnouncer } from '@/composables/useAnnouncer'
import type { Role, User, UserStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { announce } = useAnnouncer()
const { state, add, update, remove } = useUsers()

// ---- Filters ---------------------------------------------------------------
const search = ref('')
const roleFilter = ref<(string | number)[]>([])
const statusFilter = ref<string>('all')
const page = ref(1)
const pageSize = ref(10)
const sort = ref<SortState | null>({ key: 'name', direction: 'asc' })
const selected = ref<(string | number)[]>([])
const loading = ref(true)
onMounted(() => setTimeout(() => (loading.value = false), 450))

const roles: Role[] = ['Owner', 'Admin', 'Manager', 'Analyst', 'Member']
const statuses: UserStatus[] = ['active', 'inactive', 'pending', 'suspended']

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return state.list.filter(
    (u) =>
      (!q || `${u.name} ${u.email} ${u.department}`.toLowerCase().includes(q)) &&
      (!roleFilter.value.length || roleFilter.value.includes(u.role)) &&
      (statusFilter.value === 'all' || u.status === statusFilter.value),
  )
})
const sortedAll = computed(() => {
  if (!sort.value) return filtered.value
  const { key, direction } = sort.value
  const dir = direction === 'asc' ? 1 : -1
  return [...filtered.value].sort((a, b) => String(a[key as keyof User]).localeCompare(String(b[key as keyof User]), undefined, { numeric: true }) * dir)
})
const pageRows = computed(() => sortedAll.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))
watch([search, roleFilter, statusFilter], () => {
  page.value = 1
  announce(`${filtered.value.length} users found`)
})
const activeFilters = computed(() => !!search.value || roleFilter.value.length > 0 || statusFilter.value !== 'all')
function clearFilters() {
  search.value = ''
  roleFilter.value = []
  statusFilter.value = 'all'
}

const columns: Column<User>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true, hideBelow: 'sm' },
  { key: 'department', label: 'Department', sortable: true, hideBelow: 'lg' },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'lastActive', label: 'Last active', sortable: true, hideBelow: 'md' },
  { key: 'actions', label: 'Actions', align: 'end', hideLabel: true, width: '56px' },
]
const roleColor: Record<Role, 'brand' | 'info' | 'neutral' | 'success' | 'warning'> = { Owner: 'brand', Admin: 'brand', Manager: 'info', Analyst: 'neutral', Member: 'neutral' }

// ---- Add / edit -------------------------------------------------------------
const formOpen = ref(false)
const editing = ref<User | null>(null)
const form = useForm(
  { name: '', email: '', phone: '', role: 'Member' as Role, department: 'Operations', status: 'pending' as UserStatus, location: 'Nairobi, Kenya' },
  { name: [rules.required('Name')], email: [rules.required('Email'), rules.email()], phone: [rules.phone()] },
)
function openAdd() {
  editing.value = null
  Object.assign(form.values, { name: '', email: '', phone: '', role: 'Member', department: 'Operations', status: 'pending', location: 'Nairobi, Kenya' })
  Object.keys(form.errors).forEach((k) => ((form.errors as any)[k] = null))
  form.submitted.value = false
  formOpen.value = true
}
function openEdit(u: User) {
  editing.value = u
  Object.assign(form.values, { name: u.name, email: u.email, phone: u.phone, role: u.role, department: u.department, status: u.status, location: u.location })
  Object.keys(form.errors).forEach((k) => ((form.errors as any)[k] = null))
  formOpen.value = true
}
async function saveUser() {
  const ok = await form.handleSubmit(async (v) => {
    await new Promise((r) => setTimeout(r, 500))
    if (state.list.some((u) => u.email.toLowerCase() === v.email.toLowerCase() && u.id !== editing.value?.id)) {
      form.errors.email = 'A user with this email already exists'
      throw new Error('dup')
    }
    if (editing.value) update(editing.value.id, { ...v })
    else add({ ...v, lastActive: new Date().toISOString(), joined: new Date().toISOString().slice(0, 10) })
  }).catch(() => false)
  if (ok) {
    formOpen.value = false
    toast.success(editing.value ? 'User updated' : 'Invitation sent', editing.value ? form.values.name : `${form.values.email} will receive an email to join.`)
  }
}

// ---- View --------------------------------------------------------------------
const viewing = ref<User | null>(null)
const viewOpen = computed({ get: () => !!viewing.value, set: (v) => !v && (viewing.value = null) })

// ---- Delete & bulk -----------------------------------------------------------
const deleteIds = ref<number[]>([])
const deleteOpen = computed({ get: () => deleteIds.value.length > 0, set: (v) => !v && (deleteIds.value = []) })
async function confirmDelete() {
  await new Promise((r) => setTimeout(r, 600))
  const n = deleteIds.value.length
  remove(deleteIds.value)
  selected.value = selected.value.filter((id) => !deleteIds.value.includes(Number(id)))
  if (viewing.value && deleteIds.value.includes(viewing.value.id)) viewing.value = null
  toast.success(n === 1 ? 'User deleted' : `${n} users deleted`)
}
function bulkStatus(status: UserStatus) {
  selected.value.forEach((id) => update(Number(id), { status }))
  toast.success(`${selected.value.length} users set to ${status}`)
  selected.value = []
}
function exportCsv(rows: User[]) {
  downloadCsv('akwap-users.csv', rows.map(({ id, name, email, role, department, status, lastActive }) => ({ id, name, email, role, department, status, lastActive })))
  toast.success('Export started', `${rows.length} users exported to CSV.`)
}
function rowMenu(u: User) {
  return [
    { label: 'View details', icon: Eye, onSelect: () => (viewing.value = u) },
    { label: 'Edit user', icon: Pencil, onSelect: () => openEdit(u) },
    u.status === 'suspended'
      ? { label: 'Reactivate', icon: CircleCheck, onSelect: () => (update(u.id, { status: 'active' }), toast.success(`${u.name} reactivated`)) }
      : { label: 'Suspend', icon: Ban, disabled: u.role === 'Owner', onSelect: () => (update(u.id, { status: 'suspended' }), toast.warning(`${u.name} suspended`)) },
    { divider: true },
    { label: 'Delete user', icon: Trash2, danger: true, disabled: u.role === 'Owner', onSelect: () => (deleteIds.value = [u.id]) },
  ]
}

// Deep links from the command palette / quick actions.
watch(
  () => route.query,
  (q) => {
    if (q.invite) {
      openAdd()
      router.replace({ query: {} })
    }
    if (q.view) {
      viewing.value = state.list.find((u) => u.id === Number(q.view)) ?? null
      router.replace({ query: {} })
    }
  },
  { immediate: true },
)
const statusOptions = [{ label: 'All statuses', value: 'all' }, ...statuses.map((s) => ({ label: s[0]!.toUpperCase() + s.slice(1), value: s }))]
</script>

<template>
  <div>
    <PageHeader title="Users" :description="`${state.list.length} people in your organisation. Manage roles, access and invitations.`">
      <template #actions>
        <AkButton :icon="Download" @click="exportCsv(sortedAll)">Export</AkButton>
        <AkButton variant="primary" :icon="UserPlus" data-testid="add-user" @click="openAdd">Add user</AkButton>
      </template>
    </PageHeader>

    <!-- Toolbar -->
    <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
      <AkInput v-model="search" type="search" placeholder="Search by name, email or department" aria-label="Search users" class="lg:max-w-sm" data-testid="user-search" />
      <div class="flex flex-wrap items-center gap-2">
        <AkMultiSelect v-model="roleFilter" :options="roles.map((r) => ({ label: r, value: r }))" placeholder="All roles" aria-label="Filter by role" class="w-full sm:w-56" :searchable="false" />
        <AkSelect v-model="statusFilter" :options="statusOptions" aria-label="Filter by status" class="w-full sm:w-44" />
        <AkButton v-if="activeFilters" variant="subtle" :icon="X" @click="clearFilters">Clear filters</AkButton>
      </div>
    </div>

    <!-- Bulk actions bar -->
    <Transition name="ak-fade">
      <div v-if="selected.length" class="mb-3 flex flex-wrap items-center gap-2 rounded-card border border-brand-secondary bg-brand-subtle px-3 py-2" role="region" aria-label="Bulk actions">
        <span class="mr-2 text-body-1-strong text-primary" aria-live="polite">{{ selected.length }} selected</span>
        <AkButton size="sm" :icon="CircleCheck" @click="bulkStatus('active')">Activate</AkButton>
        <AkButton size="sm" :icon="Ban" @click="bulkStatus('suspended')">Suspend</AkButton>
        <AkButton size="sm" :icon="Download" @click="exportCsv(state.list.filter((u) => selected.includes(u.id)))">Export</AkButton>
        <AkButton size="sm" variant="danger" :icon="Trash2" @click="deleteIds = selected.map(Number).filter((id) => state.list.find((u) => u.id === id)?.role !== 'Owner')">Delete</AkButton>
        <AkButton size="sm" variant="subtle" class="ml-auto" @click="selected = []">Clear selection</AkButton>
      </div>
    </Transition>

    <AkDataTable
      v-model:sort="sort"
      v-model:selected="selected"
      :columns="columns"
      :rows="pageRows"
      caption="Users"
      hide-caption
      selectable
      manual-sort
      :loading="loading"
      empty-title="No users match your filters"
      empty-description="Try a different search term or clear the filters."
      min-width="560px"
    >
      <template #cell-name="{ row }">
        <button type="button" class="-m-1 flex min-w-0 items-center gap-3 rounded-md p-1 text-left focus-ring" @click="viewing = row">
          <AkAvatar :name="row.name" :size="32" decorative />
          <span class="min-w-0">
            <span class="block truncate font-semibold text-primary hover:underline">{{ row.name }}</span>
            <span class="block truncate text-caption-1 text-tertiary">{{ row.email }}</span>
          </span>
        </button>
      </template>
      <template #cell-role="{ row }"><AkBadge :color="roleColor[row.role as Role]">{{ row.role }}</AkBadge></template>
      <template #cell-status="{ row }"><AkStatusIndicator :status="row.status" size="sm" /></template>
      <template #cell-lastActive="{ row }"><time :datetime="row.lastActive" class="text-secondary">{{ formatRelative(row.lastActive) }}</time></template>
      <template #cell-actions="{ row }">
        <AkMenu :items="rowMenu(row)" placement="bottom-end">
          <template #trigger="{ attrs }">
            <AkButton v-bind="attrs" size="sm" variant="subtle" icon-only :icon="MoreHorizontal" :aria-label="`Actions for ${row.name}`">Actions</AkButton>
          </template>
        </AkMenu>
      </template>
      <template v-if="activeFilters" #empty>
        <div class="py-8 text-center">
          <p class="text-subtitle-2 text-primary">No users match your filters</p>
          <p class="mt-1 text-body-1 text-secondary">Try a different search term or clear the filters.</p>
          <AkButton class="mt-3" @click="clearFilters">Clear filters</AkButton>
        </div>
      </template>
    </AkDataTable>

    <AkPagination v-model:page="page" v-model:page-size="pageSize" :total="filtered.length" class="mt-4" label="Users pagination" />

    <!-- Add / edit dialog -->
    <AkDialog v-model:open="formOpen" :title="editing ? `Edit ${editing.name}` : 'Add user'" :description="editing ? undefined : 'They will receive an email invitation to join your organisation.'" size="md">
      <form id="user-form" class="grid gap-4 sm:grid-cols-2" novalidate @submit.prevent="saveUser">
        <AkField label="Full name" required :error="form.errors.name" class="sm:col-span-2"><AkInput v-model="form.values.name" data-autofocus @blur="form.blur('name')" @input="form.input('name')" /></AkField>
        <AkField label="Email" required :error="form.errors.email"><AkInput v-model="form.values.email" type="email" @blur="form.blur('email')" @input="form.input('email')" /></AkField>
        <AkField label="Phone" optional :error="form.errors.phone"><AkInput v-model="form.values.phone" type="tel" @blur="form.blur('phone')" /></AkField>
        <AkField label="Role" helper="Admins can manage users and settings."><AkSelect v-model="form.values.role" :options="roles.filter((r) => r !== 'Owner')" /></AkField>
        <AkField label="Department"><AkSelect v-model="form.values.department" :options="['Operations', 'Finance', 'Sales', 'Support', 'Engineering', 'Marketing']" /></AkField>
        <AkField v-if="editing" label="Status"><AkSelect v-model="form.values.status" :options="statuses" /></AkField>
      </form>
      <template #footer="{ close }">
        <AkButton @click="close">Cancel</AkButton>
        <AkButton type="submit" form="user-form" variant="primary" :loading="form.submitting.value">{{ editing ? 'Save changes' : 'Send invitation' }}</AkButton>
      </template>
    </AkDialog>

    <!-- View drawer -->
    <AkDrawer v-model:open="viewOpen" :title="viewing?.name ?? 'User'" size="md">
      <div v-if="viewing" class="flex flex-col gap-6 p-5">
        <div class="flex items-center gap-4">
          <AkAvatar :name="viewing.name" :size="64" :presence="viewing.status === 'active' ? 'available' : 'offline'" />
          <div>
            <p class="text-subtitle-1 text-primary">{{ viewing.name }}</p>
            <p class="text-body-1 text-secondary">{{ viewing.role }} · {{ viewing.department }}</p>
            <AkStatusIndicator :status="viewing.status" size="sm" class="mt-1" />
          </div>
        </div>
        <AkDescriptionList
          dividers
          :items="[
            { term: 'Email', description: viewing.email },
            { term: 'Phone', description: viewing.phone },
            { term: 'Location', description: viewing.location },
            { term: 'Department', description: viewing.department },
            { term: 'Joined', description: formatDate(viewing.joined) },
            { term: 'Last active', description: formatRelative(viewing.lastActive) },
          ]"
          layout="stacked"
        />
      </div>
      <template #footer>
        <AkButton variant="danger" :icon="Trash2" :disabled="viewing?.role === 'Owner'" @click="viewing && (deleteIds = [viewing.id])">Delete</AkButton>
        <AkButton variant="primary" :icon="Pencil" @click="viewing && (openEdit(viewing), (viewing = null))">Edit</AkButton>
      </template>
    </AkDrawer>

    <AkConfirmDialog
      v-model:open="deleteOpen"
      :title="deleteIds.length === 1 ? 'Delete this user?' : `Delete ${deleteIds.length} users?`"
      :description="deleteIds.length === 1 ? `${state.list.find((u) => u.id === deleteIds[0])?.name} will lose access immediately. This can't be undone.` : 'They will lose access immediately. This can\'t be undone.'"
      confirm-label="Delete"
      intent="danger"
      :on-confirm="confirmDelete"
    />
  </div>
</template>
