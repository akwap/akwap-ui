<script setup lang="ts">
/** The type ramp, rendered with the real utilities. */
const ramp = [
  { cls: 'text-display', name: 'Display', spec: '40–68px fluid / 1.35 / 600', use: 'Marketing hero only' },
  { cls: 'text-large-title', name: 'Large title', spec: '32–40px fluid / 1.3 / 600', use: 'Landing section titles' },
  { cls: 'text-title-1', name: 'Title 1', spec: '32 / 40 / 600', use: 'Page titles' },
  { cls: 'text-title-2', name: 'Title 2', spec: '28 / 36 / 600', use: 'Auth and empty-state titles' },
  { cls: 'text-title-3', name: 'Title 3', spec: '24 / 32 / 600', use: 'Section headings' },
  { cls: 'text-subtitle-1', name: 'Subtitle 1', spec: '20 / 26 / 600', use: 'Card and dialog titles' },
  { cls: 'text-subtitle-2', name: 'Subtitle 2', spec: '16 / 22 / 600', use: 'Group headings' },
  { cls: 'text-body-2', name: 'Body 2', spec: '16 / 22 / 400', use: 'Lead paragraphs' },
  { cls: 'text-body-1', name: 'Body 1', spec: '14 / 20 / 400', use: 'Default UI text' },
  { cls: 'text-body-1-strong', name: 'Body 1 strong', spec: '14 / 20 / 600', use: 'Emphasis, labels' },
  { cls: 'text-caption-1', name: 'Caption 1', spec: '12 / 16 / 400', use: 'Helper text, metadata' },
  { cls: 'text-caption-1-strong', name: 'Caption 1 strong', spec: '12 / 16 / 600', use: 'Overlines, small labels' },
  { cls: 'text-caption-2', name: 'Caption 2', spec: '10 / 14 / 400', use: 'Badges, dense charts' },
]
</script>

<template>
  <ul class="divide-y divide-line-subtle rounded-card border border-line-subtle bg-surface">
    <li v-for="r in ramp" :key="r.cls" class="grid gap-2 px-4 py-4 md:grid-cols-[minmax(0,1fr)_14rem] md:items-center">
      <p class="min-w-0 truncate text-primary" :class="r.cls">{{ r.name }}</p>
      <div class="text-caption-1">
        <code class="font-mono font-semibold text-brand">{{ r.cls }}</code>
        <p class="text-secondary">{{ r.spec }}</p>
        <p class="text-tertiary">{{ r.use }}</p>
      </div>
    </li>
  </ul>
</template>
