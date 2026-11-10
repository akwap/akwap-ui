<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { PanelLeftClose, PanelLeftOpen, Menu, Search, LayoutDashboard, Users, ChartLine, Bell, ScrollText, Settings, UserRound, SlidersHorizontal, BookOpen, UserPlus, Download, Moon, Sun, Lock } from '@lucide/vue'
import AkLogo from '@/components/shared/AkLogo.vue'
import AkThemeSwitcher from '@/components/shared/AkThemeSwitcher.vue'
import AkProfileMenu from '@/components/shared/AkProfileMenu.vue'
import AkNotificationPanel from '@/components/shared/AkNotificationPanel.vue'
import AkNavList, { type NavSection } from '@/components/ui/navigation/AkNavList.vue'
import AkBreadcrumb from '@/components/ui/navigation/AkBreadcrumb.vue'
import AkButton from '@/components/ui/buttons/AkButton.vue'
import AkDrawer from '@/components/ui/overlays/AkDrawer.vue'
import AkDialog from '@/components/ui/overlays/AkDialog.vue'
import AkCommandPalette, { type Command } from '@/components/ui/overlays/AkCommandPalette.vue'
import AkKbd from '@/components/ui/data-display/AkKbd.vue'
import AkEmptyState from '@/components/ui/feedback/AkEmptyState.vue'
import { dashboardNav } from '@/config/navigation'
import { hasRole, session } from '@/stores/session'
import { useNotifications } from '@/stores/notifications'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { useTheme } from '@/composables/useTheme'
import { users } from '@/services/mockData'

/**
 * DashboardLayout — application shell.
 *  ≥1280px  expanded sidebar (collapsible, remembered)
 *  768–1279 collapsed icon rail with tooltips
 *  <768px   off-canvas drawer navigation
 */
const route = useRoute()
const router = useRouter()
const { unread } = useNotifications()
const { toggle: toggleTheme, resolved } = useTheme()

const isDesktop = useMediaQuery('(min-width: 1280px)')
const isTablet = useMediaQuery('(min-width: 768px)')
const STORAGE = 'akwapui:sidebar-collapsed'
const userCollapsed = ref<boolean>((() => {
  try {
    return localStorage.getItem(STORAGE) === '1'
  } catch {
    return false
  }
})())
const collapsed = computed(() => (isDesktop.value ? userCollapsed.value : true))
const drawerOpen = ref(false)
const paletteOpen = ref(false)
const shortcutsOpen = ref(false)

function toggleSidebar() {
  if (!isTablet.value) {
    drawerOpen.value = true
    return
  }
  userCollapsed.value = !userCollapsed.value
  try {
    localStorage.setItem(STORAGE, userCollapsed.value ? '1' : '0')
  } catch {
    /* ignore */
  }
}

// Role-based visibility + live notification badge.
const sections = computed<NavSection[]>(() =>
  dashboardNav
    .map((s) => ({
      ...s,
      items: s.items
        .filter((i) => hasRole(i.roles))
        .map((i) => (i.to === '/dashboard/notifications' ? { ...i, badge: unread.value || undefined } : i)),
    }))
    .filter((s) => s.items.length),
)

const crumbs = computed(() => {
  const labels = (route.meta.crumbs as string[] | undefined) ?? [String(route.meta.title ?? '')]
  return labels.map((label, i) => ({
    label,
    to: i < labels.length - 1 ? (label === 'Dashboard' ? '/dashboard' : label === 'Account' ? '/account/profile' : undefined) : undefined,
  }))
})
const allowed = computed(() => hasRole(route.meta.roles as string[] | undefined))

const commands = computed<Command[]>(() => [
  { id: 'overview', label: 'Overview', group: 'Pages', icon: LayoutDashboard, run: () => router.push('/dashboard') },
  { id: 'analytics', label: 'Analytics', group: 'Pages', icon: ChartLine, run: () => router.push('/dashboard/analytics') },
  { id: 'users', label: 'Users', group: 'Pages', icon: Users, run: () => router.push('/dashboard/users') },
  { id: 'notifications', label: 'Notifications', group: 'Pages', icon: Bell, run: () => router.push('/dashboard/notifications') },
  { id: 'activity', label: 'Activity logs', group: 'Pages', icon: ScrollText, run: () => router.push('/dashboard/activity') },
  { id: 'settings', label: 'System settings', group: 'Pages', icon: Settings, run: () => router.push('/dashboard/settings') },
  { id: 'profile', label: 'My profile', group: 'Pages', icon: UserRound, run: () => router.push('/account/profile') },
  { id: 'prefs', label: 'Account settings', group: 'Pages', icon: SlidersHorizontal, run: () => router.push('/account/settings') },
  { id: 'docs', label: 'Design system docs', group: 'Pages', icon: BookOpen, run: () => router.push('/docs') },
  { id: 'invite', label: 'Invite a user', group: 'Actions', icon: UserPlus, keywords: 'add new member', run: () => router.push({ path: '/dashboard/users', query: { invite: '1' } }) },
  { id: 'export', label: 'Export analytics report', group: 'Actions', icon: Download, run: () => router.push({ path: '/dashboard/analytics', query: { export: '1' } }) },
  { id: 'theme', label: resolved.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme', group: 'Actions', icon: resolved.value === 'dark' ? Sun : Moon, shortcut: 'Shift D', run: toggleTheme },
  ...users.slice(0, 12).map((u) => ({ id: `user-${u.id}`, label: u.name, group: 'People', icon: UserRound, keywords: `${u.email} ${u.role}`, run: () => router.push({ path: '/dashboard/users', query: { view: String(u.id) } }) })),
])

function onGlobalKey(e: KeyboardEvent) {
  const target = e.target as HTMLElement
  const typing = target.closest('input, textarea, select, [contenteditable="true"]')
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    paletteOpen.value = !paletteOpen.value
  } else if (!typing && e.key === '/' ) {
    e.preventDefault()
    paletteOpen.value = true
  } else if (!typing && e.key === '?') {
    shortcutsOpen.value = true
  } else if (!typing && e.shiftKey && e.key.toLowerCase() === 'd') {
    toggleTheme()
  } else if (!typing && e.key === '[' ) {
    toggleSidebar()
  }
}
onMounted(() => window.addEventListener('keydown', onGlobalKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKey))
watch(() => route.fullPath, () => (drawerOpen.value = false))
</script>

<template>
  <div class="flex min-h-dvh bg-background">
    <!-- Sidebar (tablet + desktop) -->
    <aside
      class="sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line-subtle bg-surface transition-[width] duration-normal ease-standard md:flex"
      :class="collapsed ? 'w-16' : 'w-64'"
      aria-label="Sidebar"
      data-testid="sidebar"
      :data-collapsed="collapsed ? 'true' : 'false'"
    >
      <div class="flex h-14 shrink-0 items-center border-b border-line-subtle" :class="collapsed ? 'justify-center px-2' : 'px-4'">
        <RouterLink to="/dashboard" class="rounded-control focus-ring" aria-label="Akwap dashboard home">
          <AkLogo :show-text="!collapsed" />
        </RouterLink>
      </div>
      <div class="flex-1 overflow-y-auto py-4" :class="collapsed ? 'px-2' : 'px-3'">
        <AkNavList :sections="sections" :collapsed="collapsed" />
      </div>
      <div class="border-t border-line-subtle p-2" :class="collapsed && 'flex justify-center'">
        <AkButton
          v-if="isDesktop"
          variant="subtle"
          :icon-only="collapsed"
          :icon="collapsed ? PanelLeftOpen : PanelLeftClose"
          :class="!collapsed && 'w-full justify-start'"
          :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          :aria-expanded="collapsed ? 'false' : 'true'"
          data-testid="sidebar-toggle"
          @click="toggleSidebar"
        >
          {{ collapsed ? 'Expand sidebar' : 'Collapse sidebar' }}
        </AkButton>
      </div>
    </aside>

    <!-- Mobile drawer -->
    <AkDrawer v-model:open="drawerOpen" side="left" size="sm" title="Navigation">
      <div class="p-3">
        <AkNavList :sections="sections" label="Mobile" @navigate="drawerOpen = false" />
      </div>
    </AkDrawer>

    <div class="flex min-w-0 flex-1 flex-col">
      <header class="sticky top-0 z-[var(--ak-z-nav)] flex h-14 shrink-0 items-center gap-2 border-b border-line-subtle bg-surface px-3 sm:px-4">
        <AkButton
          variant="subtle"
          icon-only
          :icon="Menu"
          class="md:hidden"
          aria-label="Open navigation"
          :aria-expanded="drawerOpen ? 'true' : 'false'"
          data-testid="mobile-nav-toggle"
          @click="drawerOpen = true"
        >
          Open navigation
        </AkButton>
        <RouterLink to="/dashboard" class="rounded-control focus-ring md:hidden" aria-label="Akwap dashboard home"><AkLogo size="sm" :show-text="false" /></RouterLink>
        <AkBreadcrumb :items="crumbs" class="min-w-0 max-sm:hidden" />
        <div class="ml-auto flex items-center gap-1">
          <button
            type="button"
            class="hidden h-8 w-56 items-center gap-2 rounded-control border border-line bg-surface-secondary px-2.5 text-body-1 text-tertiary transition-colors hover:border-line-hover focus-ring lg:flex"
            data-testid="command-palette-trigger"
            @click="paletteOpen = true"
          >
            <Search class="size-4" aria-hidden="true" />
            <span class="flex-1 text-left">Search…</span>
            <AkKbd>Ctrl K</AkKbd>
          </button>
          <AkButton variant="subtle" icon-only :icon="Search" class="lg:hidden" aria-label="Search" @click="paletteOpen = true">Search</AkButton>
          <AkThemeSwitcher />
          <AkNotificationPanel />
          <AkProfileMenu @shortcuts="shortcutsOpen = true" />
        </div>
      </header>

      <main id="main" tabindex="-1" class="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8">
        <RouterView v-if="allowed" />
        <AkEmptyState
          v-else
          variant="forbidden"
          :icon="Lock"
          title="You don't have access to this page"
          :description="`Your current role (${session.role}) can't view ${String(route.meta.title)}. Ask an administrator for access, or switch role from the profile menu.`"
          size="lg"
          :heading-level="2"
        >
          <AkButton variant="primary" to="/dashboard">Back to overview</AkButton>
        </AkEmptyState>
      </main>
    </div>

    <AkCommandPalette v-model:open="paletteOpen" :commands="commands" />

    <AkDialog v-model:open="shortcutsOpen" title="Keyboard shortcuts" size="sm">
      <dl class="flex flex-col divide-y divide-line-subtle">
        <div v-for="s in [
          { keys: ['Ctrl', 'K'], label: 'Open command palette' },
          { keys: ['/'], label: 'Search' },
          { keys: ['['], label: 'Toggle sidebar' },
          { keys: ['Shift', 'D'], label: 'Toggle dark theme' },
          { keys: ['?'], label: 'Show this dialog' },
          { keys: ['Esc'], label: 'Close dialogs and menus' },
        ]" :key="s.label" class="flex items-center justify-between py-2.5">
          <dt class="text-body-1 text-primary">{{ s.label }}</dt>
          <dd class="flex gap-1"><AkKbd v-for="k in s.keys" :key="k">{{ k }}</AkKbd></dd>
        </div>
      </dl>
    </AkDialog>
  </div>
</template>
