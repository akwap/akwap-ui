<script setup lang="ts">
/**
 * Akwap Systems mark: a globe (meridians + latitudes) wrapped by a tilted
 * orbit, with a four-point star rising off the orbit. Original artwork.
 * Colours come from tokens so the mark follows the theme.
 */
import { useId } from 'vue'

withDefaults(defineProps<{ size?: number; animated?: boolean }>(), { size: 36, animated: false })
const uid = useId()
const g = `akg-${uid}`
const s = `aks-${uid}`
const clip = `akc-${uid}`
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 64 64" aria-hidden="true" class="ak-mark shrink-0" :class="{ 'ak-mark--animated': animated }">
    <defs>
      <linearGradient :id="g" x1="10" y1="54" x2="54" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="var(--site-jade)" />
        <stop offset="1" stop-color="var(--site-sun)" />
      </linearGradient>
      <radialGradient :id="s" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="var(--site-sun)" stop-opacity="0.9" />
        <stop offset="1" stop-color="var(--site-sun)" stop-opacity="0" />
      </radialGradient>
      <clipPath :id="clip"><circle cx="30" cy="34" r="20" /></clipPath>
    </defs>

    <!-- globe body -->
    <circle cx="30" cy="34" r="20" fill="none" :stroke="`url(#${g})`" stroke-width="3" />
    <g :clip-path="`url(#${clip})`" fill="none" :stroke="`url(#${g})`" stroke-width="1.8" opacity="0.9">
      <ellipse class="ak-mark__meridian" cx="30" cy="34" rx="8" ry="20" />
      <line x1="30" y1="14" x2="30" y2="54" />
      <path d="M10.5 27h39M10.5 41h39" />
      <line x1="10" y1="34" x2="50" y2="34" />
    </g>

    <!-- orbit -->
    <g transform="rotate(-28 30 34)" fill="none" :stroke="`url(#${g})`" stroke-width="2.2" stroke-linecap="round">
      <!-- back half (behind the globe) is dimmer, front half is full strength -->
      <path d="M2 34 A28 9 0 0 1 58 34" opacity="0.35" />
      <path d="M58 34 A28 9 0 0 1 2 34" />
    </g>

    <!-- star -->
    <g class="ak-mark__star">
      <circle cx="52" cy="13" r="10" :fill="`url(#${s})`" opacity="0.55" />
      <path d="M52 3.5 54.1 10.9 61.5 13 54.1 15.1 52 22.5 49.9 15.1 42.5 13 49.9 10.9Z" fill="var(--site-sun)" />
      <circle cx="52" cy="13" r="1.6" fill="var(--site-star-core)" />
    </g>
  </svg>
</template>

<style scoped>
.ak-mark--animated .ak-mark__star {
  transform-origin: 52px 13px;
  animation: ak-twinkle 3.6s ease-in-out infinite;
}
.ak-mark--animated .ak-mark__meridian {
  transform-origin: 30px 34px;
  animation: ak-spin 9s linear infinite;
}
@keyframes ak-twinkle {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.8); opacity: 0.75; }
}
@keyframes ak-spin {
  0% { transform: scaleX(1); }
  25% { transform: scaleX(0.15); }
  50% { transform: scaleX(1); }
  75% { transform: scaleX(0.15); }
  100% { transform: scaleX(1); }
}
@media (prefers-reduced-motion: reduce) {
  .ak-mark--animated .ak-mark__star,
  .ak-mark--animated .ak-mark__meridian { animation: none; }
}
</style>
