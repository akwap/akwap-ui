<script setup lang="ts">
import { AkIcon, type IconSize } from '@/design-system'

const sizes: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
</script>

<template>
  <ul class="flex flex-wrap items-end gap-6 text-primary">
    <li v-for="s in sizes" :key="s" class="flex flex-col items-center gap-2">
      <AkIcon name="notification" :size="s" />
      <span class="font-mono text-caption-1 text-secondary">{{ s }}</span>
    </li>
  </ul>
</template>
