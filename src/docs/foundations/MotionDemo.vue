<script setup lang="ts">
import { ref } from 'vue'
import { Play } from '@lucide/vue'
import { AkButton } from '@/design-system'

/** Durations and easing curves. Respects reduced motion like the rest of the system. */
const durations = [
  ['ultra-fast', 50], ['faster', 100], ['fast', 150], ['normal', 200], ['gentle', 250], ['slow', 300], ['slower', 400],
] as const
const easings = [
  ['standard', 'cubic-bezier(0.33, 0, 0.67, 1)', 'Most transitions'],
  ['decelerate', 'cubic-bezier(0.1, 0.9, 0.2, 1)', 'Things entering'],
  ['accelerate', 'cubic-bezier(0.9, 0.1, 1, 0.2)', 'Things leaving'],
] as const
const on = ref(false)
</script>

<template>
  <div class="flex flex-col gap-6">
    <AkButton :icon="Play" :pressed="on" @click="on = !on">{{ on ? 'Reset' : 'Play' }} animations</AkButton>
    <div class="grid gap-6 lg:grid-cols-2">
      <ul class="flex flex-col gap-2" aria-label="Durations">
        <li v-for="[name, ms] in durations" :key="name" class="flex items-center gap-3">
          <code class="w-36 shrink-0 font-mono text-caption-1 text-brand">--ak-duration-{{ name }}</code>
          <span class="relative h-6 flex-1 rounded-sm bg-surface-tertiary">
            <span class="absolute top-1 left-1 size-4 rounded-full bg-brand transition-[left] ease-standard" :style="{ transitionDuration: `${ms}ms`, left: on ? 'calc(100% - 20px)' : '4px' }" aria-hidden="true" />
          </span>
          <span class="w-12 text-right text-caption-1 text-secondary">{{ ms }}ms</span>
        </li>
      </ul>
      <ul class="flex flex-col gap-3" aria-label="Easing curves">
        <li v-for="[name, curve, use] in easings" :key="name">
          <div class="flex items-baseline justify-between gap-2">
            <code class="font-mono text-caption-1 text-brand">ease-{{ name }}</code>
            <span class="text-caption-1 text-tertiary">{{ use }}</span>
          </div>
          <span class="relative mt-1 block h-6 rounded-sm bg-surface-tertiary">
            <span class="absolute top-1 size-4 rounded-full bg-brand transition-[left] duration-[600ms]" :style="{ transitionTimingFunction: curve, left: on ? 'calc(100% - 20px)' : '4px' }" aria-hidden="true" />
          </span>
        </li>
      </ul>
    </div>
    <p class="text-caption-1 text-tertiary">With “reduce motion” turned on in your OS (or in Account settings), these transitions complete instantly.</p>
  </div>
</template>
