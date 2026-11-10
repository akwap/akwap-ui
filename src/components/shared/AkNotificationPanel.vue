<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, CheckCheck, ShieldAlert, CreditCard, Users, AtSign, Info } from '@lucide/vue'
import AkDrawer from '../ui/overlays/AkDrawer.vue'
import AkButton from '../ui/buttons/AkButton.vue'
import AkTabs from '../ui/navigation/AkTabs.vue'
import AkEmptyState from '../ui/feedback/AkEmptyState.vue'
import { useNotifications } from '@/stores/notifications'
import { formatRelative } from '@/utils/format'
import type { NotificationKind } from '@/types'

/** Header bell + slide-over panel listing recent notifications. */
const { items, unread, markRead, markAllRead } = useNotifications()
const router = useRouter()
const open = ref(false)
const tab = ref('all')
const list = computed(() => (tab.value === 'unread' ? items.value.filter((n) => !n.read) : items.value))
const icons: Record<NotificationKind, typeof Bell> = { security: ShieldAlert, billing: CreditCard, team: Users, mention: AtSign, system: Info }

function openItem(id: number, link?: string) {
  markRead(id)
  if (link) {
    open.value = false
    router.push(link)
  }
}
</script>

<template>
  <AkButton
    variant="subtle"
    icon-only
    :icon="Bell"
    :aria-label="unread ? `Notifications, ${unread} unread` : 'Notifications'"
    data-testid="notifications-button"
    @click="open = true"
  >
    Notifications
    <template #end>
      <span v-if="unread" class="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-strong px-1 text-caption-2 font-semibold text-on-brand" aria-hidden="true">
        {{ unread }}
      </span>
    </template>
  </AkButton>
  <AkDrawer v-model:open="open" title="Notifications" size="md">
    <template #header-actions>
      <AkButton size="sm" variant="subtle" :icon="CheckCheck" :disabled="!unread" @click="markAllRead">Mark all read</AkButton>
    </template>
    <div class="px-5 pt-2">
      <AkTabs v-model="tab" :tabs="[{ id: 'all', label: 'All' }, { id: 'unread', label: 'Unread', badge: unread }]" label="Filter notifications" size="sm">
        <template #panel>
          <ul v-if="list.length" class="-mx-3 flex flex-col pb-2">
            <li v-for="n in list" :key="n.id">
              <button type="button" class="flex w-full gap-3 rounded-md p-3 text-left hover:bg-subtle-hover focus-ring" @click="openItem(n.id, n.link)">
                <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-tertiary text-secondary" aria-hidden="true">
                  <component :is="icons[n.kind]" class="size-4" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="flex items-start gap-2">
                    <span class="flex-1 text-body-1" :class="n.read ? 'text-secondary' : 'font-semibold text-primary'">{{ n.title }}</span>
                    <span v-if="!n.read" class="mt-1.5 size-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    <span v-if="!n.read" class="sr-only">(unread)</span>
                  </span>
                  <span class="mt-0.5 line-clamp-2 block text-caption-1 text-secondary">{{ n.body }}</span>
                  <time :datetime="n.time" class="mt-1 block text-caption-1 text-tertiary">{{ formatRelative(n.time) }}</time>
                </span>
              </button>
            </li>
          </ul>
          <AkEmptyState v-else variant="success" title="You're all caught up" description="New notifications will appear here." size="sm" />
        </template>
      </AkTabs>
    </div>
    <template #footer>
      <AkButton variant="subtle" block to="/dashboard/notifications" @click="open = false">View all notifications</AkButton>
    </template>
  </AkDrawer>
</template>
