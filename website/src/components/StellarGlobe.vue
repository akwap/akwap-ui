<script setup lang="ts">
/**
 * StellarGlobe: the hero visual. A rotating dotted globe on canvas, wrapped by
 * two orbits carrying "satellites", in a twinkling starfield, with the brand's
 * four-point star. Renders a single still frame under prefers-reduced-motion
 * and pauses when off screen.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let raf = 0
let observer: IntersectionObserver | null = null
let resizeObs: ResizeObserver | null = null
let visible = true

// Canvas needs concrete colours; these mirror --site-jade / --site-sun.
const JADE = 'rgb(63, 209, 188)'
const SUN = 'rgb(246, 192, 77)'

function withAlpha(rgb: string, a: number) {
  const m = rgb.match(/[\d.]+/g)
  if (!m || m.length < 3) return rgb
  return `rgba(${m[0]}, ${m[1]}, ${m[2]}, ${a})`
}

onMounted(() => {
  const el = canvas.value
  if (!el) return
  const ctx = el.getContext('2d')
  if (!ctx) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const jade = JADE
  const sun = SUN

  // Fibonacci sphere points; a band of "land" points is brighter.
  const N = 900
  const pts: { x: number; y: number; z: number; land: boolean }[] = []
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = i * Math.PI * (3 - Math.sqrt(5))
    const x = Math.cos(t) * r
    const z = Math.sin(t) * r
    const lon = Math.atan2(z, x)
    const land = Math.sin(lon * 2.0 + y * 3.1) + Math.cos(lon * 3.0 - y * 1.7) * 0.8 > 0.55
    pts.push({ x, y, z, land })
  }
  const stars = Array.from({ length: 140 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.2 + 0.2,
    p: Math.random() * Math.PI * 2,
  }))

  let w = 0
  let h = 0
  let dpr = 1
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = el.clientWidth
    h = el.clientHeight
    el.width = Math.round(w * dpr)
    el.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (reduce) draw(0.6)
  }

  const tilt = -0.38
  function draw(t: number) {
    ctx!.clearRect(0, 0, w, h)
    const cx = w * 0.5
    const cy = h * 0.5
    const R = Math.min(w, h) * 0.34

    // starfield
    for (const s of stars) {
      const a = 0.35 + 0.35 * Math.sin(t * 1.4 + s.p)
      ctx!.fillStyle = `rgba(255,255,255,${a})`
      ctx!.beginPath()
      ctx!.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2)
      ctx!.fill()
    }

    // atmosphere glow
    const glow = ctx!.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.45)
    glow.addColorStop(0, withAlpha(jade, 0.18))
    glow.addColorStop(1, withAlpha(jade, 0))
    ctx!.fillStyle = glow
    ctx!.beginPath()
    ctx!.arc(cx, cy, R * 1.45, 0, Math.PI * 2)
    ctx!.fill()

    const rot = t * 0.18
    const cosR = Math.cos(rot)
    const sinR = Math.sin(rot)
    const cosT = Math.cos(tilt)
    const sinT = Math.sin(tilt)

    const orbit = (rx: number, ry: number, ang: number, speed: number, color: string, back: boolean) => {
      ctx!.save()
      ctx!.translate(cx, cy)
      ctx!.rotate(ang)
      ctx!.strokeStyle = withAlpha(color, 0.35)
      ctx!.lineWidth = 1.2
      ctx!.beginPath()
      // back half drawn before globe, front half after
      if (back) ctx!.ellipse(0, 0, rx, ry, 0, Math.PI, Math.PI * 2)
      else ctx!.ellipse(0, 0, rx, ry, 0, 0, Math.PI)
      ctx!.stroke()
      const a = (t * speed) % (Math.PI * 2)
      const inFront = Math.sin(a) > 0
      if (inFront !== back) {
        const sx = Math.cos(a) * rx
        const sy = Math.sin(a) * ry
        ctx!.fillStyle = color
        ctx!.shadowColor = color
        ctx!.shadowBlur = 12
        ctx!.beginPath()
        ctx!.arc(sx, sy, 3.2, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.restore()
    }

    orbit(R * 1.55, R * 0.42, -0.45, 0.5, sun, true)
    orbit(R * 1.3, R * 0.32, 0.55, -0.32, jade, true)

    // globe disc
    ctx!.fillStyle = 'rgba(10, 24, 34, 0.9)'
    ctx!.beginPath()
    ctx!.arc(cx, cy, R, 0, Math.PI * 2)
    ctx!.fill()

    for (const p of pts) {
      const x1 = p.x * cosR - p.z * sinR
      const z1 = p.x * sinR + p.z * cosR
      const y2 = p.y * cosT - z1 * sinT
      const z2 = p.y * sinT + z1 * cosT
      if (z2 < -0.05) continue
      const depth = (z2 + 1) / 2
      const size = (p.land ? 1.9 : 1.1) * (0.6 + depth * 0.8)
      ctx!.fillStyle = withAlpha(p.land ? jade : 'rgb(180,220,230)', p.land ? 0.45 + depth * 0.55 : 0.14 + depth * 0.3)
      ctx!.beginPath()
      ctx!.arc(cx + x1 * R, cy + y2 * R, size, 0, Math.PI * 2)
      ctx!.fill()
    }

    // rim light
    ctx!.strokeStyle = withAlpha(jade, 0.5)
    ctx!.lineWidth = 1.5
    ctx!.beginPath()
    ctx!.arc(cx, cy, R, 0, Math.PI * 2)
    ctx!.stroke()

    orbit(R * 1.55, R * 0.42, -0.45, 0.5, sun, false)
    orbit(R * 1.3, R * 0.32, 0.55, -0.32, jade, false)

    // brand star
    const sx = cx + R * 0.95
    const sy = cy - R * 0.98
    const pulse = 1 + 0.08 * Math.sin(t * 2)
    const sr = R * 0.2 * pulse
    const halo = ctx!.createRadialGradient(sx, sy, 0, sx, sy, sr * 2.2)
    halo.addColorStop(0, withAlpha(sun, 0.55))
    halo.addColorStop(1, withAlpha(sun, 0))
    ctx!.fillStyle = halo
    ctx!.beginPath()
    ctx!.arc(sx, sy, sr * 2.2, 0, Math.PI * 2)
    ctx!.fill()
    ctx!.fillStyle = sun
    ctx!.beginPath()
    const k = 0.22
    ctx!.moveTo(sx, sy - sr)
    ctx!.lineTo(sx + sr * k, sy - sr * k)
    ctx!.lineTo(sx + sr, sy)
    ctx!.lineTo(sx + sr * k, sy + sr * k)
    ctx!.lineTo(sx, sy + sr)
    ctx!.lineTo(sx - sr * k, sy + sr * k)
    ctx!.lineTo(sx - sr, sy)
    ctx!.lineTo(sx - sr * k, sy - sr * k)
    ctx!.closePath()
    ctx!.fill()
    ctx!.fillStyle = '#fff'
    ctx!.beginPath()
    ctx!.arc(sx, sy, sr * 0.12, 0, Math.PI * 2)
    ctx!.fill()
  }

  const start = performance.now()
  const loop = (now: number) => {
    if (visible) draw((now - start) / 1000)
    raf = requestAnimationFrame(loop)
  }

  resize()
  resizeObs = new ResizeObserver(resize)
  resizeObs.observe(el)
  if (reduce) {
    draw(0.6)
  } else {
    observer = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting))
    observer.observe(el)
    raf = requestAnimationFrame(loop)
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  observer?.disconnect()
  resizeObs?.disconnect()
})
</script>

<template>
  <canvas ref="canvas" class="block size-full" aria-hidden="true" />
</template>
