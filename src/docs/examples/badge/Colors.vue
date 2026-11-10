<script setup lang="ts">
import { AkBadge } from '@/design-system'
const colors = ['brand', 'neutral', 'success', 'warning', 'danger', 'info'] as const
</script>

<template>
  <div class="flex flex-col gap-3">
    <div v-for="a in ['filled', 'tint', 'outline'] as const" :key="a" class="flex flex-wrap items-center gap-2">
      <span class="w-16 text-caption-1 text-tertiary">{{ a }}</span>
      <AkBadge v-for="c in colors" :key="c" :color="c" :appearance="a">{{ c }}</AkBadge>
    </div>
  </div>
</template>
