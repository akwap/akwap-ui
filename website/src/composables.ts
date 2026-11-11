import { onBeforeUnmount, onMounted } from 'vue'

/** Fade-and-rise elements marked .site-reveal as they scroll into view. */
export function useReveal() {
  let io: IntersectionObserver | null = null
  onMounted(() => {
    const els = document.querySelectorAll<HTMLElement>('.site-reveal:not(.is-visible)')
    if (!('IntersectionObserver' in window)) return els.forEach((e) => e.classList.add('is-visible'))
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io?.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    els.forEach((e) => io!.observe(e))
  })
  onBeforeUnmount(() => io?.disconnect())
}
