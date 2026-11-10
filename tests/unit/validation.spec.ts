import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { passwordStrength, rules, useForm, validate } from '@/design-system'
import { contrastRatio, hexToOklch } from '@/utils/color'

describe('validation rules', () => {
  it('required handles strings, arrays and booleans', () => {
    const r = rules.required('Name')
    expect(r('')).toBe('Name is required')
    expect(r('  ')).toBe('Name is required')
    expect(r('Amina')).toBe(true)
    expect(r([])).toBe('Name is required')
    expect(r(['a'])).toBe(true)
    expect(r(false)).toBe('Name is required')
  })

  it('email, minLength, phone and matches', () => {
    expect(rules.email()('amina@akwap.example')).toBe(true)
    expect(rules.email()('amina@akwap')).toMatch(/valid email/)
    expect(rules.minLength(8, 'Password')('short')).toMatch(/at least 8/)
    expect(rules.phone()('+254 712 345 678')).toBe(true)
    expect(rules.phone()('12ab')).toMatch(/valid phone/)
    expect(rules.matches(() => 'abc')('abc')).toBe(true)
    expect(rules.matches(() => 'abc', 'Passwords do not match')('abd')).toBe('Passwords do not match')
  })

  it('validate returns the first failing message', () => {
    expect(validate('', [rules.required('Email'), rules.email()])).toBe('Email is required')
    expect(validate('x', [rules.required('Email'), rules.email()])).toMatch(/valid email/)
    expect(validate('a@b.co', [rules.required('Email'), rules.email()])).toBeNull()
  })

  it('scores password strength', () => {
    expect(passwordStrength('').score).toBe(0)
    expect(passwordStrength('abc').score).toBeLessThan(2)
    expect(passwordStrength('Akwap!2026').score).toBeGreaterThanOrEqual(3)
  })
})

describe('useForm', () => {
  it('validates on blur, then live, and guards submit', async () => {
    const form = useForm({ email: '' }, { email: [rules.required('Email'), rules.email()] })
    form.input('email')
    await nextTick()
    expect(form.errors.email).toBeUndefined() // not touched yet
    form.blur('email')
    expect(form.errors.email).toBe('Email is required')
    form.values.email = 'amina@akwap.example'
    form.input('email')
    await nextTick()
    expect(form.errors.email).toBeNull()

    let called = 0
    form.values.email = 'bad'
    expect(await form.handleSubmit(() => void called++)).toBe(false)
    expect(called).toBe(0)
    expect(form.errorCount()).toBe(1)
    form.values.email = 'amina@akwap.example'
    expect(await form.handleSubmit(() => void called++)).toBe(true)
    expect(called).toBe(1)
    expect(form.submitting.value).toBe(false)
  })
})

describe('colour maths', () => {
  it('computes WCAG contrast', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5)
    expect(contrastRatio('#767676', '#ffffff')).toBeGreaterThanOrEqual(4.5)
  })
  it('converts hex to OKLCH', () => {
    const white = hexToOklch('#ffffff')
    expect(white.l).toBeCloseTo(1, 2)
    expect(white.c).toBeLessThan(0.001)
    const blue = hexToOklch('#2d6bc4')
    expect(blue.h).toBeGreaterThan(240)
    expect(blue.h).toBeLessThan(265)
  })
})
