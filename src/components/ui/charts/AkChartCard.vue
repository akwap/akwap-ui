<script setup lang="ts">
/**
 * AkChartCard — standard container for a chart: title, optional
 * description, actions (filters/export) and a footer note.
 */
withDefaults(defineProps<{ title: string; description?: string; headingLevel?: 2 | 3 }>(), { headingLevel: 3 })
</script>

<template>
  <section class="flex min-w-0 flex-col gap-4 rounded-card border border-line-subtle bg-surface p-4 sm:p-card">
    <header class="flex flex-wrap items-start gap-3">
      <div class="min-w-0 flex-1">
        <component :is="`h${headingLevel}`" class="text-subtitle-2 text-primary">{{ title }}</component>
        <p v-if="description" class="mt-0.5 text-caption-1 text-tertiary">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="flex shrink-0 flex-wrap items-center gap-2"><slot name="actions" /></div>
    </header>
    <div class="min-w-0"><slot /></div>
    <footer v-if="$slots.footer" class="text-caption-1 text-tertiary"><slot name="footer" /></footer>
  </section>
</template>
