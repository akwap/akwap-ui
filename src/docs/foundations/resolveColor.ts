/**
 * Resolves any CSS colour (including oklch() and var()) to #rrggbb by
 * painting it on a 1×1 canvas. Used by the docs to show live token values
 * and contrast ratios that follow the current theme and brand.
 */
let ctx: CanvasRenderingContext2D | null = null

export function resolveCssVar(name: string, el: Element = document.documentElement): string {
  const raw = getComputedStyle(el).getPropertyValue(name).trim()
  return toHex(raw)
}

export function toHex(color: string): string {
  if (!color) return '#000000'
  if (!ctx) {
    const c = document.createElement('canvas')
    c.width = c.height = 1
    ctx = c.getContext('2d', { willReadFrequently: true })
  }
  if (!ctx) return '#000000'
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = '#000'
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `#${[r, g, b].map((v) => v!.toString(16).padStart(2, '0')).join('')}`
}
