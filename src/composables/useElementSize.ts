import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export function useElementSize(el: Ref<HTMLElement | null | undefined>, initial = { width: 600, height: 240 }) {
  const width = ref(initial.width)
  const height = ref(initial.height)
  let ro: ResizeObserver | null = null
  onMounted(() => {
    if (!el.value || typeof ResizeObserver === 'undefined') return
    ro = new ResizeObserver(([entry]) => {
      if (!entry) return
      width.value = Math.max(1, Math.round(entry.contentRect.width))
      height.value = Math.max(1, Math.round(entry.contentRect.height))
    })
    ro.observe(el.value)
  })
  onBeforeUnmount(() => ro?.disconnect())
  return { width, height }
}
