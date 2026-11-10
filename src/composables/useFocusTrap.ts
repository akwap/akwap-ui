import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',')

export function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('inert') && el.getAttribute('aria-hidden') !== 'true' && el.getClientRects().length > 0,
  )
}

/**
 * Traps Tab focus inside `container` while `active` is true, moves focus in
 * on activation and restores it to the previously focused element after.
 */
export function useFocusTrap(
  container: Ref<HTMLElement | null | undefined>,
  active: Ref<boolean>,
  opts: { initialFocus?: () => HTMLElement | null | undefined } = {},
) {
  let previouslyFocused: HTMLElement | null = null

  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Tab' || !container.value) return
    const items = getFocusable(container.value)
    if (items.length === 0) {
      e.preventDefault()
      container.value.focus()
      return
    }
    const first = items[0]!
    const last = items[items.length - 1]!
    const current = document.activeElement as HTMLElement | null
    if (e.shiftKey && (current === first || !container.value.contains(current))) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && (current === last || !container.value.contains(current))) {
      e.preventDefault()
      first.focus()
    }
  }

  async function activate() {
    previouslyFocused = document.activeElement as HTMLElement | null
    await nextTick()
    const el = container.value
    if (!el) return
    const target = opts.initialFocus?.() ?? el.querySelector<HTMLElement>('[autofocus],[data-autofocus]') ?? getFocusable(el)[0] ?? el
    target.focus({ preventScroll: true })
    document.addEventListener('keydown', onKeydown, true)
  }

  function deactivate() {
    document.removeEventListener('keydown', onKeydown, true)
    if (previouslyFocused && document.contains(previouslyFocused)) {
      previouslyFocused.focus({ preventScroll: true })
    }
    previouslyFocused = null
  }

  watch(active, (v) => (v ? activate() : deactivate()), { immediate: true })
  onBeforeUnmount(deactivate)
}
