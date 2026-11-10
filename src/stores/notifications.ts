import { computed, reactive } from 'vue'
import { notifications as seed } from '@/services/mockData'
import type { AppNotification } from '@/types'

const state = reactive<{ items: AppNotification[] }>({ items: seed.map((n) => ({ ...n })) })

/** Shared notification state used by the header panel and Notifications page. */
export function useNotifications() {
  return {
    items: computed(() => state.items),
    unread: computed(() => state.items.filter((n) => !n.read).length),
    markRead: (id: number, read = true) => {
      const n = state.items.find((x) => x.id === id)
      if (n) n.read = read
    },
    markAllRead: () => state.items.forEach((n) => (n.read = true)),
    remove: (id: number) => {
      const i = state.items.findIndex((x) => x.id === id)
      if (i !== -1) state.items.splice(i, 1)
    },
  }
}
