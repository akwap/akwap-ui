import { onBeforeUnmount, ref } from 'vue'

export function useMediaQuery(query: string) {
  const mql = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query) : null
  const matches = ref(mql?.matches ?? false)
  const update = (e: MediaQueryListEvent) => (matches.value = e.matches)
  mql?.addEventListener?.('change', update)
  onBeforeUnmount(() => mql?.removeEventListener?.('change', update))
  return matches
}

/** Breakpoints mirror the Tailwind @theme values. */
export const breakpoints = {
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
}
