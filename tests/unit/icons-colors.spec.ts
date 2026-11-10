import { mount } from '@vue/test-utils'
import { Rocket } from '@lucide/vue'
import { describe, expect, it } from 'vitest'
import AkIcon from '@/components/ui/icons/AkIcon.vue'
import AkBadge from '@/components/ui/data-display/AkBadge.vue'
import AkAvatar from '@/components/ui/data-display/AkAvatar.vue'
import { icons, iconGroups } from '@/components/ui/icons/icons'
import { ACCENT_COLORS, accentFor, isAccentColor } from '@/components/ui/accent'

describe('AkIcon', () => {
  it('is decorative by default', () => {
    const svg = mount(AkIcon, { props: { name: 'delete' } }).find('svg')
    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('role')).toBeUndefined()
    expect(svg.attributes('width')).toBe('20')
  })

  it('becomes an image with a label', () => {
    const svg = mount(AkIcon, { props: { name: 'warning', label: 'Warning' } }).find('svg')
    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('aria-label')).toBe('Warning')
    expect(svg.attributes('aria-hidden')).toBeUndefined()
  })

  it('accepts any icon component, sizes and colours', () => {
    const w = mount(AkIcon, { props: { icon: Rocket, size: 'xl', color: 'teal' } })
    expect(w.find('svg').classes()).toContain('lucide-rocket')
    expect(w.find('svg').attributes('width')).toBe('32')
    expect(w.find('svg').classes()).toContain('text-teal')
    expect(mount(AkIcon, { props: { name: 'add', size: 14, color: 'danger' } }).find('svg').attributes('width')).toBe('14')
    expect(mount(AkIcon, { props: { name: 'add', color: 'danger' } }).find('svg').classes()).toContain('text-danger')
  })

  it('has one component per semantic name', () => {
    const names = Object.values(iconGroups).flatMap((g) => Object.keys(g))
    expect(new Set(names).size).toBe(names.length)
    for (const n of names) expect(icons[n as keyof typeof icons]).toBeTruthy()
  })
})

describe('accent colours', () => {
  it('assigns a stable accent per key', () => {
    expect(accentFor('Finance')).toBe(accentFor('Finance'))
    expect(ACCENT_COLORS).toContain(accentFor('anything'))
    expect(new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(accentFor)).size).toBeGreaterThan(3)
    expect(isAccentColor('teal')).toBe(true)
    expect(isAccentColor('success')).toBe(false)
  })

  it('colours badges with accent roles', () => {
    expect(mount(AkBadge, { props: { color: 'purple' }, slots: { default: 'Beta' } }).classes()).toEqual(expect.arrayContaining(['bg-purple-background', 'text-purple', 'border-purple-border']))
    expect(mount(AkBadge, { props: { color: 'purple', appearance: 'filled' }, slots: { default: 'Beta' } }).classes()).toEqual(expect.arrayContaining(['bg-purple-strong', 'text-on-accent']))
  })

  it('lets avatars pick an accent', () => {
    const html = mount(AkAvatar, { props: { name: 'Wanjiru Kamau', color: 'indigo' } }).html()
    expect(html).toContain('bg-indigo-background')
    expect(html).toContain('text-indigo')
  })
})
