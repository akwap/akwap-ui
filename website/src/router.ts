import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import SiteLayout from './components/SiteLayout.vue'
import HomePage from './pages/HomePage.vue'
import { serviceBySlug } from './content'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: SiteLayout,
    children: [
      { path: '', component: HomePage, meta: { title: 'IoT, Software, Smart Irrigation & Solar' } },
      { path: 'solutions/:slug', component: () => import('./pages/SolutionPage.vue') },
      { path: 'about', component: () => import('./pages/AboutPage.vue'), meta: { title: 'About' } },
      { path: 'contact', component: () => import('./pages/ContactPage.vue'), meta: { title: 'Contact' } },
      { path: ':pathMatch(.*)*', component: () => import('./pages/NotFoundPage.vue'), meta: { title: 'Page not found' } },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, top: 72, behavior: 'smooth' }
    return { top: 0 }
  },
})

export function pageTitle(path: string, title?: unknown, slug?: unknown): string {
  const service = path.startsWith('/solutions/') ? serviceBySlug(String(slug)) : undefined
  return service?.name ?? (typeof title === 'string' ? title : 'Akwap Systems')
}

router.afterEach((to) => {
  const t = pageTitle(to.path, to.meta.title, to.params.slug)
  document.title = `${t} · Akwap Systems`
})
