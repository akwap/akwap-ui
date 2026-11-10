<script setup lang="ts">
/** 4px spacing scale. Tailwind's spacing unit is set to 4px. */
const steps = [
  ['1', 4], ['2', 8], ['3', 12], ['4', 16], ['5', 20], ['6', 24], ['8', 32], ['10', 40], ['12', 48], ['16', 64], ['20', 80], ['24', 96],
] as const
const semantic = [
  ['control-x', '12px', 'Horizontal padding inside controls'],
  ['card', '20px', 'Card padding (sm and up)'],
  ['page', '24px', 'Page gutters on desktop'],
  ['stack', '16px', 'Vertical gap between form fields'],
  ['inline', '8px', 'Gap between inline items'],
  ['section', '64px', 'Gap between page sections'],
] as const
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <ul class="flex flex-col gap-2">
      <li v-for="[k, px] in steps" :key="k" class="flex items-center gap-3">
        <code class="w-14 font-mono text-caption-1 text-brand">p-{{ k }}</code>
        <span class="h-3 rounded-sm bg-brand" :style="{ width: `${px}px` }" aria-hidden="true" />
        <span class="text-caption-1 text-secondary">{{ px }}px · --ak-space-{{ k }}</span>
      </li>
    </ul>
    <ul class="flex flex-col gap-2">
      <li v-for="[k, v, use] in semantic" :key="k" class="rounded-md border border-line-subtle bg-surface px-3 py-2">
        <code class="font-mono text-caption-1 font-semibold text-brand">p-{{ k }} / gap-{{ k }}</code>
        <span class="ml-2 text-caption-1 text-secondary">{{ v }}</span>
        <p class="text-caption-1 text-tertiary">{{ use }}</p>
      </li>
    </ul>
  </div>
</template>
