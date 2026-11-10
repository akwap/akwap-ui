import type { InjectionKey, Ref } from 'vue'

export interface RadioGroupContext {
  name: string
  model: Ref<string | number | null | undefined>
  disabled: Ref<boolean>
  invalid: Ref<boolean>
  select: (value: string | number) => void
}
export const RADIO_KEY: InjectionKey<RadioGroupContext> = Symbol('AkRadioGroup')
