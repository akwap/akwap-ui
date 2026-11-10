<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { User, Settings, LogOut, HelpCircle, ShieldCheck, Keyboard } from '@lucide/vue'
import AkMenu, { type MenuItem } from '../ui/overlays/AkMenu.vue'
import AkAvatar from '../ui/data-display/AkAvatar.vue'
import { session, signOut } from '@/stores/session'
import type { Role } from '@/types'

/** Profile menu: identity, account links, role preview and sign out. */
const emit = defineEmits<{ shortcuts: [] }>()
const router = useRouter()
const roles: Role[] = ['Admin', 'Manager', 'Analyst', 'Member']

const items = computed<MenuItem[]>(() => [
  { header: true, label: session.user.email },
  { label: 'View profile', icon: User, onSelect: () => router.push('/account/profile') },
  { label: 'Account settings', icon: Settings, onSelect: () => router.push('/account/settings') },
  { label: 'Keyboard shortcuts', icon: Keyboard, shortcut: '?', onSelect: () => emit('shortcuts') },
  { label: 'Help & documentation', icon: HelpCircle, onSelect: () => router.push('/docs') },
  { divider: true },
  { header: true, label: 'Preview as role' },
  ...roles.map((r) => ({ key: `role-${r}`, label: r, icon: ShieldCheck, checked: session.role === r, onSelect: () => (session.role = r) })),
  { divider: true },
  {
    label: 'Sign out',
    icon: LogOut,
    onSelect: () => {
      signOut()
      router.push({ path: '/auth/login', query: { signedOut: '1' } })
    },
  },
])
</script>

<template>
  <AkMenu :items="items" placement="bottom-end" min-width="240px" label="Account">
    <template #trigger="{ attrs }">
      <button
        v-bind="attrs"
        type="button"
        class="flex items-center gap-2 rounded-control p-1 hover:bg-subtle-hover focus-ring lg:pr-2"
        :aria-label="`Account menu for ${session.user.name}`"
        data-testid="profile-menu"
      >
        <AkAvatar :name="session.user.name" :size="28" presence="available" decorative />
        <span class="hidden min-w-0 text-left lg:block">
          <span class="block truncate text-caption-1-strong text-primary">{{ session.user.name }}</span>
          <span class="block truncate text-caption-2 text-tertiary">{{ session.role }}</span>
        </span>
      </button>
    </template>
  </AkMenu>
</template>
