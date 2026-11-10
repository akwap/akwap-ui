import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { AkBreadcrumb, AkCard, AkLink } from '@/design-system'
import { testRouter } from './helpers'

async function routerReady() {
  const router = testRouter()
  router.push('/')
  await router.isReady()
  return router
}

describe('link rendering', () => {
  it('AkCard with `to` is a real, focusable link', async () => {
    const router = await routerReady()
    const w = mount(AkCard, { props: { to: '/docs', title: 'Docs' }, global: { plugins: [router] } })
    expect(w.element.tagName).toBe('A')
    expect(w.attributes('href')).toBe('/docs')
  })

  it('AkCard without a destination is a section', () => {
    const w = mount(AkCard, { props: { title: 'Plain' } })
    expect(w.element.tagName).toBe('SECTION')
    expect(w.attributes('href')).toBeUndefined()
  })

  it('AkLink marks external links', () => {
    const w = mount(AkLink, { props: { href: 'https://example.com', external: true }, slots: { default: 'Site' } })
    expect(w.attributes('target')).toBe('_blank')
    expect(w.text()).toContain('opens in a new tab')
  })

  it('AkBreadcrumb marks the current page', async () => {
    const router = await routerReady()
    const w = mount(AkBreadcrumb, { props: { items: [{ label: 'Dashboard', to: '/dashboard' }, { label: 'Users' }] }, global: { plugins: [router] } })
    expect(w.find('nav').attributes('aria-label')).toBe('Breadcrumb')
    expect(w.find('a').attributes('href')).toBe('/dashboard')
    expect(w.find('[aria-current="page"]').text()).toBe('Users')
  })
})
