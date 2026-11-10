<script setup lang="ts">
const levels = [
  [0, 'Flat surfaces, cards on canvas'],
  [2, 'Cards that need slight lift, sticky headers'],
  [4, 'Elevated cards, raised buttons'],
  [8, 'Tooltips, chips being dragged'],
  [16, 'Menus, popovers, toasts'],
  [28, 'Dialogs and drawers'],
] as const
</script>

<template>
  <ul class="grid gap-6 rounded-card bg-background-secondary p-6 sm:grid-cols-2 lg:grid-cols-3">
    <li v-for="[n, use] in levels" :key="n" class="rounded-card bg-surface p-4 hc:border hc:border-line" :class="`shadow-elevation-${n}`">
      <code class="font-mono text-caption-1 font-semibold text-brand">shadow-elevation-{{ n }}</code>
      <p class="mt-1 text-caption-1 text-secondary">{{ use }}</p>
    </li>
  </ul>
</template>
