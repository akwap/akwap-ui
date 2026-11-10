import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import { AkField, AkInput, AkCheckbox, AkSwitch } from '@/design-system'

function fieldWith(props: Record<string, unknown>, inputProps: Record<string, unknown> = {}) {
  return mount(defineComponent({ render: () => h(AkField, { label: 'Email', ...props }, () => h(AkInput, inputProps)) }))
}

describe('AkField + AkInput', () => {
  it('connects the label to the input', () => {
    const w = fieldWith({})
    const label = w.find('label')
    const input = w.find('input')
    expect(label.attributes('for')).toBe(input.attributes('id'))
    expect(label.text()).toContain('Email')
  })

  it('links helper text with aria-describedby', () => {
    const w = fieldWith({ helper: 'We never share it' })
    const input = w.find('input')
    const ids = input.attributes('aria-describedby')!.split(' ')
    const helper = w.find(`#${ids[0]}`)
    expect(helper.text()).toContain('We never share it')
  })

  it('marks the input invalid and describes it with the error', () => {
    const w = fieldWith({ error: 'Enter a valid email address' })
    const input = w.find('input')
    expect(input.attributes('aria-invalid')).toBe('true')
    const ids = input.attributes('aria-describedby')!.split(' ')
    expect(ids.map((id) => w.find(`#${id}`).text()).join(' ')).toContain('Enter a valid email address')
  })

  it('shows a required marker and sets required on the control', () => {
    const w = fieldWith({ required: true })
    expect(w.find('label').text()).toContain('*')
    expect(w.find('input').attributes('required')).toBeDefined()
  })

  it('updates v-model and clears with the clear button', async () => {
    const value = ref('report')
    const w = mount(defineComponent({
      render: () => h(AkInput, { modelValue: value.value, 'onUpdate:modelValue': (v: unknown) => (value.value = v as string), clearable: true, type: 'search', 'aria-label': 'Search' }),
    }))
    await w.find('input').setValue('q3 report')
    expect(value.value).toBe('q3 report')
    await w.find('button[aria-label="Clear"]').trigger('click')
    expect(value.value).toBe('')
  })

  it('toggles password visibility', async () => {
    const w = mount(AkInput, { props: { type: 'password', modelValue: 'secret' }, attrs: { 'aria-label': 'Password' } })
    expect(w.find('input').attributes('type')).toBe('password')
    const toggle = w.find('button[aria-label="Show password"]')
    await toggle.trigger('click')
    expect(w.find('input').attributes('type')).toBe('text')
    expect(w.find('button[aria-pressed="true"]').attributes('aria-label')).toBe('Hide password')
  })
})

describe('AkCheckbox and AkSwitch', () => {
  it('supports an array v-model', async () => {
    const selected = ref<string[]>(['email'])
    const w = mount(defineComponent({
      render: () =>
        ['email', 'sms'].map((v) =>
          h(AkCheckbox, { modelValue: selected.value, value: v, label: v, 'onUpdate:modelValue': (n: unknown) => (selected.value = n as string[]) }),
        ),
    }))
    const boxes = w.findAll('input[type="checkbox"]')
    expect((boxes[0]!.element as HTMLInputElement).checked).toBe(true)
    await boxes[1]!.setValue(true)
    expect(selected.value).toEqual(['email', 'sms'])
  })

  it('switch uses role="switch" and a native checkbox', async () => {
    const w = mount(AkSwitch, { props: { modelValue: false, label: 'Dark mode' } })
    const input = w.find('input')
    expect(input.attributes('role')).toBe('switch')
    await input.setValue(true)
    expect(w.emitted('update:modelValue')![0]).toEqual([true])
  })
})
