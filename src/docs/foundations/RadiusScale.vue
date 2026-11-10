<script setup lang="ts">
const radii = [
  ['rounded-none', '0'], ['rounded-sm', '2px'], ['rounded-md', '4px'], ['rounded-lg', '6px'], ['rounded-xl', '8px'], ['rounded-full', '9999px'],
  ['rounded-control', '--ak-radius-control'], ['rounded-card', '--ak-radius-card'], ['rounded-overlay', '--ak-radius-overlay'],
] as const
</script>

<template>
  <ul class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
    <li v-for="[cls, v] in radii" :key="cls" class="flex flex-col items-start gap-2">
      <span class="size-16 border-2 border-brand bg-brand-subtle" :class="cls" aria-hidden="true" />
      <code class="font-mono text-caption-1 font-semibold text-brand">{{ cls }}</code>
      <span class="text-caption-1 text-tertiary">{{ v }}</span>
    </li>
  </ul>
</template>
