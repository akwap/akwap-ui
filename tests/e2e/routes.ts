import { flatDocs } from '../../src/docs/nav'

/** Every application route (docs routes come from the docs navigation). */
export const appRoutes = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/dashboard',
  '/dashboard/users',
  '/dashboard/analytics',
  '/dashboard/notifications',
  '/dashboard/activity',
  '/dashboard/settings',
  '/account/profile',
  '/account/settings',
  '/this-page-does-not-exist',
]
export const docRoutes = [...flatDocs.map((d) => d.href), '/docs/playground']
