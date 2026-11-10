import type { InjectionKey } from 'vue'
export const ACCORDION_KEY: InjectionKey<{ isOpen: (v: string) => boolean; toggle: (v: string) => void; appearance: 'divided' | 'separated' }> =
  Symbol('AkAccordion')
