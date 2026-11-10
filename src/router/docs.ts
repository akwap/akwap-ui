import type { RouteRecordRaw } from 'vue-router'

export const docsRoutes: RouteRecordRaw[] = [
  {
    path: '/docs',
    component: () => import('@/layouts/DocumentationLayout.vue'),
    children: [
      { path: '', redirect: '/docs/introduction/overview' },
      { path: 'playground', name: 'playground', component: () => import('@/docs/PlaygroundPage.vue'), meta: { title: 'Playground', wide: true } },
      { path: 'components/:slug', name: 'doc-component', component: () => import('@/docs/ComponentDocPage.vue'), meta: { title: 'Components' } },
      { path: ':section/:slug', name: 'doc', component: () => import('@/docs/DocRouter.vue'), meta: { title: 'Documentation' } },
    ],
  },
]
