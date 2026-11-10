import type { ButtonSize, ButtonVariant } from '@/components/ui/buttons/AkButton.vue'
import { hexToOklch } from '@/utils/color'

export type PlaygroundTheme = 'light' | 'dark' | 'high-contrast'
export type Validation = 'none' | 'error' | 'success'

export interface PlaygroundState {
  theme: PlaygroundTheme
  brand: string
  radiusControl: number
  radiusCard: number
  button: { variant: ButtonVariant; size: ButtonSize; label: string; icon: boolean; disabled: boolean; loading: boolean }
  input: { size: 'sm' | 'md' | 'lg'; label: string; validation: Validation; disabled: boolean }
}

export const defaultState = (): PlaygroundState => ({
  theme: 'light',
  brand: '#2d6bc4',
  radiusControl: 4,
  radiusCard: 8,
  button: { variant: 'primary', size: 'md', label: 'Save changes', icon: true, disabled: false, loading: false },
  input: { size: 'md', label: 'Work email', validation: 'none', disabled: false },
})

export const MESSAGE_TYPE = 'akwapui:playground'

/** Brand seed with the same chroma clamp as useBrand().setBrandHex. */
export function brandSeed(hex: string) {
  const { h, c } = hexToOklch(hex)
  return { hue: Math.round(h), chroma: +Math.min(Math.max(c, 0.02), 0.2).toFixed(3), hex }
}

const attr = (name: string, value: string | boolean, def?: string | boolean) => {
  if (value === def) return ''
  if (value === true) return ` ${name}`
  if (value === false) return ''
  return ` ${name}="${value}"`
}

export function generateCode(s: PlaygroundState): { vue: string; css: string } {
  const b = s.button
  const i = s.input
  const button = `<AkButton${attr('variant', b.variant, 'secondary')}${attr('size', b.size, 'md')}${b.icon ? ' :icon="Save"' : ''}${attr('disabled', b.disabled)}${attr('loading', b.loading)}>
  ${b.label}
</AkButton>`
  const fieldMsg = i.validation === 'error' ? '\n  error="Enter a valid email address, like name@company.com"' : i.validation === 'success' ? '\n  success="This address is available."' : ''
  const field = `<AkField
  label="${i.label}"${attr('size', i.size, 'md')}${fieldMsg}${i.disabled ? '\n  disabled' : ''}
>
  <AkInput v-model="email" type="email"${attr('size', i.size, 'md')}${i.validation === 'success' ? ' success' : ''}${attr('disabled', i.disabled)} />
</AkField>`
  const vue = `<script setup lang="ts">
import { ref } from 'vue'${b.icon ? "\nimport { Save } from '@lucide/vue'" : ''}
import { AkButton, AkField, AkInput } from '@/design-system'

const email = ref('${i.validation === 'error' ? 'amina@akwap' : 'amina@akwap.example'}')
</script>

<template>
  ${field.split('\n').join('\n  ')}
  ${button.split('\n').join('\n  ')}
</template>`
  const seed = brandSeed(s.brand)
  const css = `/* Brand ${s.brand} and shape. Theme: <html data-theme="${s.theme}"> */
:root {
  --ak-brand-hue: ${seed.hue};
  --ak-brand-chroma: ${seed.chroma};
  --ak-radius-control: ${s.radiusControl}px;
  --ak-radius-card: ${s.radiusCard}px;
  --ak-radius-overlay: ${s.radiusCard}px;
}`
  return { vue, css }
}
