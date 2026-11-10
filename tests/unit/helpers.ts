import { createMemoryHistory, createRouter } from 'vue-router'
import { defineComponent, h } from 'vue'

/** Minimal router so components that render RouterLink can mount. */
export function testRouter() {
  const Empty = defineComponent({ render: () => h('div') })
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Empty },
      { path: '/dashboard', component: Empty },
      { path: '/docs', component: Empty },
    ],
  })
}
