import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useBrand, useTheme, useToast } from '@/design-system'

describe('useTheme', () => {
  afterEach(() => useTheme().setTheme('system'))

  it('applies and persists the chosen theme', async () => {
    const { setTheme, resolved } = useTheme()
    setTheme('dark')
    await nextTick()
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(resolved.value).toBe('dark')
    expect(localStorage.getItem('akwapui:theme')).toBe('dark')
    setTheme('high-contrast')
    await nextTick()
    expect(document.documentElement.dataset.theme).toBe('high-contrast')
  })

  it('resolves "system" from prefers-color-scheme', async () => {
    const { setTheme, resolved } = useTheme()
    setTheme('system')
    await nextTick()
    expect(resolved.value).toBe('light') // jsdom stub reports no dark preference
  })
})

describe('useBrand', () => {
  it('derives hue and chroma from a hex colour and persists it', () => {
    const { setBrandHex, brand, resetBrand } = useBrand()
    setBrandHex('#0f7b6c')
    expect(brand.value.hue).toBeGreaterThan(160)
    expect(brand.value.hue).toBeLessThan(200)
    expect(brand.value.chroma).toBeLessThanOrEqual(0.2)
    expect(document.documentElement.style.getPropertyValue('--ak-brand-hue')).toBe(String(brand.value.hue))
    expect(JSON.parse(localStorage.getItem('akwapui:brand')!).hex).toBe('#0f7b6c')
    resetBrand()
    expect(document.documentElement.style.getPropertyValue('--ak-brand-hue')).toBe('')
  })
})

describe('useToast', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    const t = useToast()
    ;[...t.toasts].forEach((x) => t.dismiss(x.id))
    vi.useRealTimers()
  })

  it('auto-dismisses after the duration', () => {
    const t = useToast()
    t.success('Saved')
    expect(t.toasts).toHaveLength(1)
    expect(t.toasts[0]!.intent).toBe('success')
    vi.advanceTimersByTime(5000)
    expect(t.toasts).toHaveLength(0)
  })

  it('keeps persistent toasts and caps the stack at four', () => {
    const t = useToast()
    t.show({ title: 'Persistent', duration: 0 })
    vi.advanceTimersByTime(60000)
    expect(t.toasts).toHaveLength(1)
    for (let i = 0; i < 5; i++) t.info(`Toast ${i}`)
    expect(t.toasts).toHaveLength(4)
    expect(t.toasts.map((x) => x.title)).not.toContain('Persistent')
  })

  it('pauses while hovered or focused', () => {
    const t = useToast()
    const id = t.info('Hover me')
    t.pause(id)
    vi.advanceTimersByTime(10000)
    expect(t.toasts).toHaveLength(1)
  })
})
