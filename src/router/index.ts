import { createRouter, createWebHistory, type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router'
import { docsRoutes } from './docs'
import { flatDocs } from '@/docs/nav'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MarketingLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/pages/marketing/HomePage.vue'), meta: { title: 'Run your business on one calm platform' } },
      { path: 'about', name: 'about', component: () => import('@/pages/marketing/AboutPage.vue'), meta: { title: 'About' } },
      { path: 'contact', name: 'contact', component: () => import('@/pages/marketing/ContactPage.vue'), meta: { title: 'Contact' } },
      { path: 'privacy', name: 'privacy', component: () => import('@/pages/marketing/LegalPage.vue'), props: { kind: 'privacy' }, meta: { title: 'Privacy policy' } },
      { path: 'terms', name: 'terms', component: () => import('@/pages/marketing/LegalPage.vue'), props: { kind: 'terms' }, meta: { title: 'Terms of service' } },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      { path: '', redirect: '/auth/login' },
      { path: 'login', name: 'login', component: () => import('@/pages/auth/LoginPage.vue'), meta: { title: 'Sign in' } },
      { path: 'register', name: 'register', component: () => import('@/pages/auth/RegisterPage.vue'), meta: { title: 'Create account' } },
      { path: 'forgot-password', name: 'forgot-password', component: () => import('@/pages/auth/ForgotPasswordPage.vue'), meta: { title: 'Forgot password' } },
      { path: 'reset-password', name: 'reset-password', component: () => import('@/pages/auth/ResetPasswordPage.vue'), meta: { title: 'Reset password' } },
      { path: 'verify-email', name: 'verify-email', component: () => import('@/pages/auth/VerifyEmailPage.vue'), meta: { title: 'Verify email' } },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/DashboardLayout.vue'),
    children: [
      { path: 'dashboard', name: 'dashboard', component: () => import('@/pages/dashboard/OverviewPage.vue'), meta: { title: 'Overview', crumbs: ['Dashboard'] } },
      { path: 'dashboard/users', name: 'users', component: () => import('@/pages/users/UserManagementPage.vue'), meta: { title: 'Users', crumbs: ['Dashboard', 'Users'], roles: ['Owner', 'Admin', 'Manager'] } },
      { path: 'dashboard/analytics', name: 'analytics', component: () => import('@/pages/analytics/AnalyticsPage.vue'), meta: { title: 'Analytics', crumbs: ['Dashboard', 'Analytics'] } },
      { path: 'dashboard/notifications', name: 'notifications', component: () => import('@/pages/dashboard/NotificationsPage.vue'), meta: { title: 'Notifications', crumbs: ['Dashboard', 'Notifications'] } },
      { path: 'dashboard/activity', name: 'activity', component: () => import('@/pages/dashboard/ActivityLogsPage.vue'), meta: { title: 'Activity logs', crumbs: ['Dashboard', 'Activity logs'], roles: ['Owner', 'Admin', 'Manager'] } },
      { path: 'dashboard/settings', name: 'system-settings', component: () => import('@/pages/settings/SystemSettingsPage.vue'), meta: { title: 'System settings', crumbs: ['Dashboard', 'Settings'], roles: ['Owner', 'Admin'] } },
      { path: 'account/profile', name: 'profile', component: () => import('@/pages/account/ProfilePage.vue'), meta: { title: 'Profile', crumbs: ['Account', 'Profile'] } },
      { path: 'account/settings', name: 'account-settings', component: () => import('@/pages/account/AccountSettingsPage.vue'), meta: { title: 'Account settings', crumbs: ['Account', 'Settings'] } },
    ],
  },
  ...docsRoutes,
  { path: '/playground-frame', name: 'playground-frame', component: () => import('@/docs/playground/PlaygroundFrame.vue'), meta: { title: 'Playground preview' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFoundPage.vue'), meta: { title: 'Page not found' } },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduced'
      return { el: to.hash, behavior: reduce ? 'auto' : 'smooth', top: 80 }
    }
    return { top: 0 }
  },
})

/** Human page title: documentation pages use their sidebar label. */
export function pageTitle(to: RouteLocationNormalized): string | undefined {
  return flatDocs.find((d) => d.href === to.path)?.label ?? (to.meta.title as string | undefined)
}

router.afterEach((to) => {
  const title = pageTitle(to)
  document.title = title ? `${title} · AkwapUI` : 'AkwapUI'
})

export { routes }
