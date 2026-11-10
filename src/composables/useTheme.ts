import { computed, ref, watch } from 'vue'

export type ThemePreference = 'light' | 'dark' | 'high-contrast' | 'system'
export type ResolvedTheme = 'light' | 'dark' | 'high-contrast'

export const THEME_STORAGE_KEY = 'akwapui:theme'
const THEMES: ThemePreference[] = ['light', 'dark', 'high-contrast', 'system']

function readStored(): ThemePreference {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null
    return v && THEMES.includes(v) ? v : 'system'
  } catch {
    return 'system'
  }
}

function media(query: string): MediaQueryList | null {
  return typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query) : null
}

// Module-level state: one theme for the whole app.
const preference = ref<ThemePreference>(readStored())
const systemDark = ref(media('(prefers-color-scheme: dark)')?.matches ?? false)
const forcedColors = ref(media('(forced-colors: active)')?.matches ?? false)

media('(prefers-color-scheme: dark)')?.addEventListener?.('change', (e) => (systemDark.value = e.matches))
media('(forced-colors: active)')?.addEventListener?.('change', (e) => (forcedColors.value = e.matches))

const resolved = computed<ResolvedTheme>(() => {
  if (preference.value !== 'system') return preference.value
  if (forcedColors.value) return 'high-contrast'
  return systemDark.value ? 'dark' : 'light'
})

function apply(theme: ResolvedTheme) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme)
}

watch(resolved, apply, { immediate: true })
watch(preference, (v) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, v)
  } catch {
    /* storage unavailable (private mode) — theme still applies for the session */
  }
})

/**
 * Global theme state.
 * - `preference` is what the user picked (including "system").
 * - `resolved` is the theme actually applied to <html data-theme>.
 */
export function useTheme() {
  function setTheme(t: ThemePreference) {
    preference.value = t
  }
  function toggle() {
    preference.value = resolved.value === 'dark' ? 'light' : 'dark'
  }
  return { preference, resolved, setTheme, toggle, themes: THEMES }
}
