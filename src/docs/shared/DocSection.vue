<script setup lang="ts">
import { Link } from '@lucide/vue'
/** Numbered/anchored section inside a doc page. */
defineProps<{ id: string; title: string; level?: 2 | 3 }>()
</script>

<template>
  <section :id="id" class="mt-12 scroll-mt-20 first:mt-0" :aria-labelledby="`${id}-h`">
    <component :is="`h${level ?? 2}`" :id="`${id}-h`" class="group flex items-center gap-2 text-primary" :class="(level ?? 2) === 2 ? 'text-title-3' : 'text-subtitle-1'">
      {{ title }}
      <a :href="`#${id}`" class="rounded-sm text-tertiary opacity-0 group-hover:opacity-100 focus:opacity-100 focus-ring" :aria-label="`Link to ${title}`"><Link class="size-4" aria-hidden="true" /></a>
    </component>
    <div class="mt-4"><slot /></div>
  </section>
</template>
