<script setup lang="ts">
/** Abstract line illustrations, one per service. Decorative only. */
import type { ServiceSlug } from '@site/content'

defineProps<{ slug: ServiceSlug; accent: string }>()
</script>

<template>
  <svg viewBox="0 0 320 200" class="size-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice" fill="none" :stroke="accent" stroke-linecap="round" stroke-linejoin="round">
    <defs>
      <radialGradient :id="`sa-glow-${slug}`" cx="0.7" cy="0.3" r="0.8">
        <stop offset="0" :stop-color="accent" stop-opacity="0.35" />
        <stop offset="1" :stop-color="accent" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="320" height="200" :fill="`url(#sa-glow-${slug})`" stroke="none" />

    <!-- IoT: a chip with circuit traces fanning out to sensor nodes -->
    <g v-if="slug === 'iot-embedded'" stroke-width="1.6">
      <rect x="130" y="70" width="60" height="60" rx="8" stroke-width="2.2" />
      <rect x="146" y="86" width="28" height="28" rx="3" opacity="0.6" />
      <path v-for="i in 5" :key="`t${i}`" :d="`M130 ${74 + i * 9} H${100 - i * 8} V${30 + i * 22} H${40 - i * 2}`" opacity="0.55" />
      <path v-for="i in 5" :key="`r${i}`" :d="`M190 ${74 + i * 9} H${220 + i * 8} V${180 - i * 24} H${290 - i * 3}`" opacity="0.55" />
      <circle v-for="i in 5" :key="`c${i}`" :cx="40 - i * 2" :cy="30 + i * 22" r="4" :fill="accent" stroke="none" />
      <circle v-for="i in 5" :key="`d${i}`" :cx="290 - i * 3" :cy="180 - i * 24" r="4" :fill="accent" stroke="none" />
      <path d="M160 70 V40 M152 40 a8 8 0 0 1 16 0 M146 40 a14 14 0 0 1 28 0" opacity="0.8" />
    </g>

    <!-- Software: stacked windows with code lines and a chart -->
    <g v-else-if="slug === 'software'" stroke-width="1.6">
      <rect x="70" y="46" width="170" height="116" rx="10" opacity="0.35" />
      <rect x="90" y="34" width="170" height="116" rx="10" stroke-width="2" />
      <path d="M90 56 H260" opacity="0.6" />
      <circle cx="104" cy="45" r="3" /><circle cx="116" cy="45" r="3" /><circle cx="128" cy="45" r="3" />
      <path d="M106 74 H150 M118 88 H180 M118 102 H160 M106 116 H140" stroke-width="3" opacity="0.8" />
      <path d="M180 136 L198 116 L214 124 L240 90" stroke-width="2.4" />
      <circle cx="240" cy="90" r="4" :fill="accent" stroke="none" />
    </g>

    <!-- Irrigation: field rows with drip lines and droplets -->
    <g v-else-if="slug === 'smart-irrigation'" stroke-width="1.6">
      <path v-for="i in 6" :key="`row${i}`" :d="`M${10 + i * 6} ${190 - i * 22} Q160 ${170 - i * 26} ${310 - i * 6} ${190 - i * 22}`" opacity="0.45" />
      <g v-for="i in 5" :key="`drop${i}`" :transform="`translate(${40 + i * 52} ${118 - (i % 2) * 22})`">
        <path d="M0 -14 C6 -6 9 -2 9 3 a9 9 0 0 1 -18 0 C-9 -2 -6 -6 0 -14Z" :fill="accent" fill-opacity="0.25" stroke-width="1.8" />
      </g>
      <path d="M20 40 H300" stroke-dasharray="2 10" stroke-width="3" opacity="0.7" />
      <circle cx="260" cy="40" r="16" stroke-width="2" /><path d="M260 30 V40 L268 46" />
    </g>

    <!-- Solar: sun with rays over a panel array -->
    <g v-else stroke-width="1.6">
      <circle cx="238" cy="52" r="22" :fill="accent" fill-opacity="0.3" stroke-width="2.2" />
      <path v-for="i in 12" :key="`ray${i}`" :d="`M${238 + Math.cos((i * Math.PI) / 6) * 32} ${52 + Math.sin((i * Math.PI) / 6) * 32} L${238 + Math.cos((i * Math.PI) / 6) * 44} ${52 + Math.sin((i * Math.PI) / 6) * 44}`" />
      <g transform="translate(40 110) skewX(-24)">
        <rect width="200" height="64" rx="4" stroke-width="2.2" />
        <path d="M50 0 V64 M100 0 V64 M150 0 V64 M0 21 H200 M0 42 H200" opacity="0.6" />
      </g>
      <path d="M90 174 V196 M170 174 V196" stroke-width="2" />
    </g>
  </svg>
</template>
