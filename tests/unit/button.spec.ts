import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { Plus } from '@lucide/vue'
import { AkButton } from '@/design-system'
import { testRouter } from './helpers'

describe('AkButton', () => {
  it('renders a native button with type="button" by default', () => {
    const w = mount(AkButton, { slots: { default: 'Save' } })
    expect(w.element.tagName).toBe('BUTTON')
    expect(w.attributes('type')).toBe('button')
    expect(w.text()).toContain('Save')
  })

  it('emits click and respects disabled', async () => {
    const w = mount(AkButton, { slots: { default: 'Go' } })
    await w.trigger('click')
    expect(w.emitted('click')).toHaveLength(1)
    const d = mount(AkButton, { props: { disabled: true }, slots: { default: 'Go' }, attachTo: document.body })
    expect(d.attributes('disabled')).toBeDefined()
    ;(d.element as HTMLButtonElement).click()
    expect(d.emitted('click')).toBeUndefined()
  })

  it('applies different classes per variant', () => {
    const primary = mount(AkButton, { props: { variant: 'primary' } }).classes().join(' ')
    const danger = mount(AkButton, { props: { variant: 'danger' } }).classes().join(' ')
    expect(primary).toContain('bg-brand')
    expect(danger).toContain('bg-danger')
    expect(primary).not.toEqual(danger)
  })

  it('shows a loading state with aria-busy and blocks clicks', async () => {
    const w = mount(AkButton, { props: { loading: true }, slots: { default: 'Saving' } })
    expect(w.attributes('aria-busy')).toBe('true')
    await w.trigger('click')
    expect(w.emitted('click')).toBeUndefined()
  })

  it('supports toggle state via aria-pressed', () => {
    expect(mount(AkButton, { props: { pressed: true } }).attributes('aria-pressed')).toBe('true')
    expect(mount(AkButton, { props: { pressed: false } }).attributes('aria-pressed')).toBe('false')
    expect(mount(AkButton).attributes('aria-pressed')).toBeUndefined()
  })

  it('icon-only buttons keep the provided accessible name', () => {
    const w = mount(AkButton, { props: { iconOnly: true, icon: Plus }, attrs: { 'aria-label': 'Add item' } })
    expect(w.attributes('aria-label')).toBe('Add item')
    expect(w.find('svg').attributes('aria-hidden')).toBe('true')
  })

  it('renders a link when given `to` or `href`', async () => {
    const router = testRouter()
    router.push('/')
    await router.isReady()
    const link = mount(AkButton, { props: { to: '/dashboard' }, slots: { default: 'Open' }, global: { plugins: [router] } })
    expect(link.element.tagName).toBe('A')
    expect(link.attributes('href')).toBe('/dashboard')
    const ext = mount(AkButton, { props: { href: 'https://example.com' }, slots: { default: 'Docs' } })
    expect(ext.element.tagName).toBe('A')
    expect(ext.attributes('href')).toBe('https://example.com')
  })
})
