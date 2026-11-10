<script setup lang="ts">
import { ref } from 'vue'
import { BarChart3, Bell, Home, Settings, Users } from '@lucide/vue'
import { AkNavList, AkSwitch, type NavSection } from '@/design-system'

const collapsed = ref(false)
const sections: NavSection[] = [
  {
    items: [
      { label: 'Overview', to: '/dashboard', icon: Home, exact: true },
      { label: 'Analytics', to: '/dashboard/analytics', icon: BarChart3 },
      { label: 'Notifications', to: '/dashboard/notifications', icon: Bell, badge: 3, badgeIntent: 'danger' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { label: 'Users', to: '/dashboard/users', icon: Users },
      {
        label: 'Settings',
        icon: Settings,
        children: [
          { label: 'System', to: '/dashboard/settings' },
          { label: 'Account', to: '/account/settings' },
        ],
      },
    ],
  },
]
</script>

<template>
  <AkSwitch v-model="collapsed" label="Collapsed (icon rail)" class="mb-4" />
  <div class="rounded-card border border-line-subtle bg-surface p-2" :class="collapsed ? 'w-16' : 'w-64 max-w-full'">
    <AkNavList :sections="sections" :collapsed="collapsed" label="Example navigation" />
  </div>
</template>
