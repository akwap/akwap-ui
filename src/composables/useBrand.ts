import { ref } from 'vue'
import { hexToOklch } from '@/utils/color'

export const BRAND_STORAGE_KEY = 'akwapui:brand'
export const DEFAULT_BRAND = { hue: 252, chroma: 0.15, hex: '#2d6bc4' }

export interface BrandSeed {
  hue: number
  chroma: number
  hex: string
}

function read(): BrandSeed {
  try {
    const raw = JSON.parse(localStorage.getItem(BRAND_STORAGE_KEY) || 'null')
    if (raw && typeof raw.hue === 'number') return raw
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_BRAND }
}

const brand = ref<BrandSeed>(read())

function apply(seed: BrandSeed, target: HTMLElement = document.documentElement) {
  target.style.setProperty('--ak-brand-hue', String(seed.hue))
  target.style.setProperty('--ak-brand-chroma', String(seed.chroma))
}

/**
 * Runtime rebranding. The whole brand ramp (--ak-brand-10 … 160) is derived
 * from a hue + chroma pair in tokens.css, so one call recolours everything.
 */
export function useBrand() {
  function setBrandHex(hex: string, persist = true) {
    const { h, c } = hexToOklch(hex)
    // Clamp chroma so the generated ramp stays in gamut and accessible.
    const seed = { hue: Math.round(h), chroma: Math.min(Math.max(c, 0.02), 0.2), hex }
    brand.value = seed
    apply(seed)
    if (persist) {
      try {
        localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(seed))
      } catch {
        /* ignore */
      }
    }
  }
  function resetBrand() {
    brand.value = { ...DEFAULT_BRAND }
    document.documentElement.style.removeProperty('--ak-brand-hue')
    document.documentElement.style.removeProperty('--ak-brand-chroma')
    try {
      localStorage.removeItem(BRAND_STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }
  return { brand, setBrandHex, resetBrand, applyBrand: apply }
}
