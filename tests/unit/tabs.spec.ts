import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { AkSegmentedControl, AkTabs } from '@/design-system'

const tabs = [
  { id: 'a', label: 'Overview' },
  { id: 'b', label: 'Activity' },
  { id: 'c', label: 'Billing', disabled: true },
  { id: 'd', label: 'Settings' },
]

describe('AkTabs', () => {
  it('renders the tabs pattern with one tab in the tab order', () => {
    const w = mount(AkTabs, { props: { tabs, modelValue: 'a', label: 'Project' } })
    expect(w.find('[role="tablist"]').attributes('aria-label')).toBe('Project')
    const t = w.findAll('[role="tab"]')
    expect(t.map((x) => x.attributes('tabindex'))).toEqual(['0', '-1', '-1', '-1'])
    expect(t[0]!.attributes('aria-selected')).toBe('true')
    const panel = w.find('[role="tabpanel"]')
    expect(panel.attributes('aria-labelledby')).toBe(t[0]!.attributes('id'))
  })

  it('moves with arrow keys, skips disabled tabs and supports Home/End', async () => {
    const w = mount(AkTabs, { props: { tabs, modelValue: 'a', 'onUpdate:modelValue': (v: string) => w.setProps({ modelValue: v }) }, attachTo: document.body })
    const list = w.find('[role="tablist"]')
    await list.trigger('keydown', { key: 'ArrowRight' })
    expect(w.props('modelValue')).toBe('b')
    await list.trigger('keydown', { key: 'ArrowRight' })
    expect(w.props('modelValue')).toBe('d') // 'c' is disabled
    await list.trigger('keydown', { key: 'Home' })
    expect(w.props('modelValue')).toBe('a')
    await list.trigger('keydown', { key: 'End' })
    expect(w.props('modelValue')).toBe('d')
    await list.trigger('keydown', { key: 'ArrowLeft' })
    expect(w.props('modelValue')).toBe('b')
  })
})

describe('AkSegmentedControl', () => {
  it('is a labelled radiogroup with arrow-key selection', async () => {
    const w = mount(AkSegmentedControl, {
      props: { label: 'View', modelValue: 'list', options: [{ label: 'List', value: 'list' }, { label: 'Grid', value: 'grid' }] },
    })
    expect(w.find('[role="radiogroup"]').attributes('aria-label')).toBe('View')
    const radios = w.findAll('[role="radio"]')
    expect(radios[0]!.attributes('aria-checked')).toBe('true')
    await w.find('[role="radiogroup"]').trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('update:modelValue')![0]).toEqual(['grid'])
  })
})
