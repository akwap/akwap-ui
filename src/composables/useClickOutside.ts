import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export function useClickOutside(
  targets: Array<Ref<HTMLElement | null | undefined>>,
  handler: (e: PointerEvent) => void,
) {
  function listener(e: PointerEvent) {
    const path = e.composedPath()
    if (targets.some((t) => t.value && path.includes(t.value))) return
    handler(e)
  }
  onMounted(() => document.addEventListener('pointerdown', listener, true))
  onBeforeUnmount(() => document.removeEventListener('pointerdown', listener, true))
}
