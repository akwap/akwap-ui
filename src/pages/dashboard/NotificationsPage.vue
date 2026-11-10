<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCheck, ShieldAlert, CreditCard, Users, AtSign, Info, MoreHorizontal, Trash2, Mail, MailOpen, ExternalLink, Settings2 } from '@lucide/vue'
import { AkBadge, AkButton, AkCard, AkEmptyState, AkMenu, AkSegmentedControl, AkSelect, AkSwitch, useToast } from '@/design-system'
import PageHeader from '@/components/layout/PageHeader.vue'
import SettingsRow from '@/components/layout/SettingsRow.vue'
import { useNotifications } from '@/stores/notifications'
import { formatDateTime, formatRelative } from '@/utils/format'
import type { NotificationKind } from '@/types'

const router = useRouter()
const toast = useToast()
const { items, unread, markRead, markAllRead, remove } = useNotifications()
const readFilter = ref<'all' | 'unread' | 'read'>('all')
const kind = ref<'all' | NotificationKind>('all')
const icons: Record<NotificationKind, typeof Info> = { security: ShieldAlert, billing: CreditCard, team: Users, mention: AtSign, system: Info }
const kindLabel: Record<NotificationKind, string> = { security: 'Security', billing: 'Billing', team: 'Team', mention: 'Mention', system: 'System' }

const list = computed(() =>
  items.value.filter(
    (n) => (readFilter.value === 'all' || (readFilter.value === 'unread' ? !n.read : n.read)) && (kind.value === 'all' || n.kind === kind.value),
  ),
)
const prefs = reactive({ security: { email: true, inApp: true }, billing: { email: true, inApp: true }, team: { email: false, inApp: true }, mention: { email: true, inApp: true }, system: { email: false, inApp: true } })
function menu(n: (typeof items.value)[number]) {
  return [
    { label: n.read ? 'Mark as unread' : 'Mark as read', icon: n.read ? Mail : MailOpen, onSelect: () => markRead(n.id, !n.read) },
    ...(n.link ? [{ label: 'Open', icon: ExternalLink, onSelect: () => (markRead(n.id), router.push(n.link!)) }] : []),
    { divider: true },
    { label: 'Delete', icon: Trash2, danger: true, onSelect: () => (remove(n.id), toast.success('Notification deleted')) },
  ]
}
</script>

<template>
  <div>
    <PageHeader title="Notifications" :description="unread ? `You have ${unread} unread notification${unread === 1 ? '' : 's'}.` : 'You are all caught up.'">
      <template #actions>
        <AkButton :icon="CheckCheck" :disabled="!unread" data-testid="mark-all-read" @click="markAllRead(), toast.success('All notifications marked as read')">Mark all as read</AkButton>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section aria-labelledby="inbox-title">
        <h2 id="inbox-title" class="sr-only">Inbox</h2>
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <AkSegmentedControl v-model="readFilter" label="Read status" :options="[{ value: 'all', label: `All (${items.length})` }, { value: 'unread', label: `Unread (${unread})` }, { value: 'read', label: 'Read' }]" />
          <AkSelect v-model="kind" aria-label="Notification type" class="w-44" :options="[{ label: 'All types', value: 'all' }, ...Object.entries(kindLabel).map(([value, label]) => ({ label, value }))]" />
        </div>
        <AkCard padding="none">
          <ul v-if="list.length" class="divide-y divide-line-subtle" aria-live="polite">
            <li v-for="n in list" :key="n.id" class="flex gap-3 p-4" :class="!n.read && 'bg-brand-subtle/40'">
              <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-tertiary text-secondary" aria-hidden="true"><component :is="icons[n.kind]" class="size-4" /></span>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="text-body-1" :class="n.read ? 'text-primary' : 'font-semibold text-primary'">{{ n.title }}</p>
                  <AkBadge v-if="!n.read" color="brand" size="sm" dot>Unread</AkBadge>
                  <AkBadge size="sm" appearance="outline">{{ kindLabel[n.kind] }}</AkBadge>
                </div>
                <p class="mt-0.5 text-body-1 text-secondary">{{ n.body }}</p>
                <div class="mt-2 flex flex-wrap items-center gap-3">
                  <time :datetime="n.time" :title="formatDateTime(n.time)" class="text-caption-1 text-tertiary">{{ formatRelative(n.time) }}</time>
                  <AkButton v-if="!n.read" variant="link" size="sm" @click="markRead(n.id)">Mark as read</AkButton>
                  <AkButton v-if="n.link" variant="link" size="sm" @click="markRead(n.id), router.push(n.link)">View</AkButton>
                </div>
              </div>
              <AkMenu :items="menu(n)" placement="bottom-end">
                <template #trigger="{ attrs }"><AkButton v-bind="attrs" variant="subtle" size="sm" icon-only :icon="MoreHorizontal" :aria-label="`More actions for ${n.title}`">More</AkButton></template>
              </AkMenu>
            </li>
          </ul>
          <AkEmptyState v-else :variant="readFilter === 'unread' ? 'success' : 'empty'" :title="readFilter === 'unread' ? 'No unread notifications' : 'Nothing here'" description="Try another filter." />
        </AkCard>
      </section>

      <AkCard title="Notification preferences" subtitle="Where each type of notification is delivered." :heading-level="2">
        <template #actions><AkButton size="sm" variant="subtle" icon-only :icon="Settings2" aria-label="All settings" to="/account/settings">All settings</AkButton></template>
        <div class="divide-y divide-line-subtle">
          <SettingsRow v-for="(label, key) in kindLabel" :key="key" :title="label">
            <div class="flex gap-4">
              <AkSwitch v-model="prefs[key].inApp" label="In-app" />
              <AkSwitch v-model="prefs[key].email" label="Email" :disabled="key === 'security'" />
            </div>
          </SettingsRow>
        </div>
        <template #footer><AkButton variant="primary" @click="toast.success('Preferences saved')">Save preferences</AkButton></template>
      </AkCard>
    </div>
  </div>
</template>
