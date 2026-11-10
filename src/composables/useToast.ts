import { reactive } from 'vue'

export type ToastIntent = 'info' | 'success' | 'warning' | 'danger'

export interface ToastOptions {
  title: string
  description?: string
  intent?: ToastIntent
  /** ms before auto-dismiss; 0 keeps it until dismissed. Default 5000. */
  duration?: number
  action?: { label: string; onClick: () => void }
}

export interface Toast extends Required<Pick<ToastOptions, 'title' | 'intent' | 'duration'>> {
  id: number
  description?: string
  action?: ToastOptions['action']
}

const state = reactive<{ toasts: Toast[] }>({ toasts: [] })
let nextId = 1
const timers = new Map<number, ReturnType<typeof setTimeout>>()

function dismiss(id: number) {
  const i = state.toasts.findIndex((t) => t.id === id)
  if (i !== -1) state.toasts.splice(i, 1)
  const timer = timers.get(id)
  if (timer) clearTimeout(timer)
  timers.delete(id)
}

function show(opts: ToastOptions): number {
  const toast: Toast = {
    id: nextId++,
    title: opts.title,
    description: opts.description,
    intent: opts.intent ?? 'info',
    duration: opts.duration ?? 5000,
    action: opts.action,
  }
  state.toasts.push(toast)
  if (state.toasts.length > 4) dismiss(state.toasts[0]!.id)
  if (toast.duration > 0) timers.set(toast.id, setTimeout(() => dismiss(toast.id), toast.duration))
  return toast.id
}

/** Imperative toast API. Render <AkToaster /> once near the app root. */
export function useToast() {
  return {
    toasts: state.toasts,
    show,
    dismiss,
    success: (title: string, description?: string) => show({ title, description, intent: 'success' }),
    error: (title: string, description?: string) => show({ title, description, intent: 'danger' }),
    warning: (title: string, description?: string) => show({ title, description, intent: 'warning' }),
    info: (title: string, description?: string) => show({ title, description, intent: 'info' }),
    pause(id: number) {
      const t = timers.get(id)
      if (t) clearTimeout(t)
      timers.delete(id)
    },
    resume(id: number) {
      const toast = state.toasts.find((t) => t.id === id)
      if (toast && toast.duration > 0 && !timers.has(id)) timers.set(id, setTimeout(() => dismiss(id), 3000))
    },
  }
}
