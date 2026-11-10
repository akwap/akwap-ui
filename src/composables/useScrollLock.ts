import { onBeforeUnmount, watch, type Ref } from 'vue'

let locks = 0
let previous = ''

/** Prevents body scroll while any overlay that uses it is open. */
export function useScrollLock(active: Ref<boolean>) {
  let held = false
  function lock() {
    if (held) return
    held = true
    if (locks++ === 0) {
      previous = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
  }
  function unlock() {
    if (!held) return
    held = false
    if (--locks === 0) document.body.style.overflow = previous
  }
  watch(active, (v) => (v ? lock() : unlock()), { immediate: true })
  onBeforeUnmount(unlock)
}
