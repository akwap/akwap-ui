import { CircleCheck, CircleAlert, Info, TriangleAlert } from '@lucide/vue'

export type Intent = 'info' | 'success' | 'warning' | 'danger'

/** Shared intent → icon/colour map. Icons ensure status is never colour-only. */
export const intentIcon = { info: Info, success: CircleCheck, warning: TriangleAlert, danger: CircleAlert } as const

export const intentClasses: Record<Intent, { surface: string; icon: string; text: string }> = {
  info: { surface: 'bg-info-background border-info-border', icon: 'text-info', text: 'text-info' },
  success: { surface: 'bg-success-background border-success-border', icon: 'text-success', text: 'text-success' },
  warning: { surface: 'bg-warning-background border-warning-border', icon: 'text-warning', text: 'text-warning' },
  danger: { surface: 'bg-danger-background border-danger-border', icon: 'text-danger', text: 'text-danger' },
}
export const intentLabel: Record<Intent, string> = { info: 'Information', success: 'Success', warning: 'Warning', danger: 'Error' }
