import { nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue'

export type Placement = 'bottom-start' | 'bottom-end' | 'bottom' | 'top-start' | 'top-end' | 'top' | 'right' | 'left'

/**
 * Minimal positioning for teleported popovers, menus and tooltips.
 * Uses fixed coordinates, flips vertically when there is no room and keeps
 * the floating element inside the viewport.
 */
export function useFloating(
  reference: Ref<HTMLElement | null | undefined>,
  floating: Ref<HTMLElement | null | undefined>,
  open: Ref<boolean>,
  opts: { placement?: Placement; offset?: number; matchWidth?: boolean } = {},
) {
  const style = ref<Record<string, string>>({ position: 'fixed', top: '0px', left: '0px' })
  const actualPlacement = ref<Placement>(opts.placement ?? 'bottom-start')
  const gap = opts.offset ?? 4

  function update() {
    const ref_ = reference.value
    const fl = floating.value
    if (!ref_ || !fl) return
    const r = ref_.getBoundingClientRect()
    const f = fl.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    let placement = opts.placement ?? 'bottom-start'
    let top = 0
    let left = 0
    const width = opts.matchWidth ? r.width : f.width

    if (placement === 'right' || placement === 'left') {
      top = r.top + r.height / 2 - f.height / 2
      left = placement === 'right' ? r.right + gap : r.left - f.width - gap
      if (placement === 'right' && left + f.width > vw - 8) {
        placement = 'left'
        left = r.left - f.width - gap
      } else if (placement === 'left' && left < 8) {
        placement = 'right'
        left = r.right + gap
      }
    } else {
      const wantsTop = placement.startsWith('top')
      const spaceBelow = vh - r.bottom
      const spaceAbove = r.top
      const goTop = wantsTop ? spaceAbove >= f.height + gap || spaceAbove > spaceBelow : spaceBelow < f.height + gap && spaceAbove > spaceBelow
      top = goTop ? r.top - f.height - gap : r.bottom + gap
      if (placement.endsWith('start')) left = r.left
      else if (placement.endsWith('end')) left = r.right - width
      else left = r.left + r.width / 2 - width / 2
      const align = placement.includes('-') ? placement.split('-')[1] : ''
      placement = ((goTop ? 'top' : 'bottom') + (align ? `-${align}` : '')) as Placement
    }
    left = Math.max(8, Math.min(left, vw - width - 8))
    top = Math.max(8, Math.min(top, vh - f.height - 8))
    actualPlacement.value = placement
    style.value = {
      position: 'fixed',
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      ...(opts.matchWidth ? { width: `${Math.round(r.width)}px` } : {}),
    }
  }

  function onScrollOrResize() {
    if (open.value) update()
  }

  watch(open, async (v) => {
    if (v) {
      await nextTick()
      update()
      window.addEventListener('scroll', onScrollOrResize, true)
      window.addEventListener('resize', onScrollOrResize)
    } else {
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScrollOrResize, true)
    window.removeEventListener('resize', onScrollOrResize)
  })

  return { style, placement: actualPlacement, update }
}
