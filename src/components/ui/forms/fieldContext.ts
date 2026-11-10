import { inject, type ComputedRef, type InjectionKey } from 'vue'

export interface FieldContext {
  id: ComputedRef<string>
  describedBy: ComputedRef<string | undefined>
  invalid: ComputedRef<boolean>
  success: ComputedRef<boolean>
  required: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
  size: ComputedRef<'sm' | 'md' | 'lg'>
}

export const FIELD_KEY: InjectionKey<FieldContext> = Symbol('AkField')

export function useField() {
  return inject(FIELD_KEY, null)
}

export const controlHeights = {
  sm: 'h-control-sm text-caption-1',
  md: 'h-control-md text-body-1',
  lg: 'h-control-lg text-body-2',
} as const

/** For controls that may grow (e.g. multi-select chips). */
export const controlMinHeights = {
  sm: 'min-h-control-sm text-caption-1',
  md: 'min-h-control-md text-body-1',
  lg: 'min-h-control-lg text-body-2',
} as const
