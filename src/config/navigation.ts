import { LayoutDashboard, Users, ChartLine, Bell, ScrollText, Settings, UserRound, SlidersHorizontal, BookOpen, Wallet, Building2 } from '@lucide/vue'
import type { NavSection } from '@/components/ui/navigation/AkNavList.vue'

/**
 * Dashboard navigation. `roles` restricts visibility; the layout filters
 * by the signed-in user's role (see stores/session.ts).
 */
export const dashboardNav: NavSection[] = [
  {
    items: [
      { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, exact: true },
      { label: 'Analytics', to: '/dashboard/analytics', icon: ChartLine },
      { label: 'Notifications', to: '/dashboard/notifications', icon: Bell, badge: 0, badgeIntent: 'brand' },
    ],
  },
  {
    title: 'Manage',
    items: [
      { label: 'Users', to: '/dashboard/users', icon: Users, roles: ['Owner', 'Admin', 'Manager'] },
      {
        label: 'Finance',
        icon: Wallet,
        roles: ['Owner', 'Admin', 'Manager', 'Analyst'],
        children: [
          { label: 'Transactions', to: '/dashboard#transactions' },
          { label: 'Revenue report', to: '/dashboard/analytics#revenue' },
        ],
      },
      { label: 'Activity logs', to: '/dashboard/activity', icon: ScrollText, roles: ['Owner', 'Admin', 'Manager'] },
      { label: 'System settings', to: '/dashboard/settings', icon: Settings, roles: ['Owner', 'Admin'] },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile', to: '/account/profile', icon: UserRound },
      { label: 'Preferences', to: '/account/settings', icon: SlidersHorizontal },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Design system', to: '/docs', icon: BookOpen },
      { label: 'Marketing site', to: '/', icon: Building2, exact: true },
    ],
  },
]
