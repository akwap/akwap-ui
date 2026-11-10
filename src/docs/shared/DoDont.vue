<script setup lang="ts">
import { CircleCheck, CircleX } from '@lucide/vue'
import Inline from './Inline'
/** Side-by-side do / don't guidance. */
defineProps<{ dos: string[]; donts: string[] }>()
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2">
    <div class="rounded-card border border-success-border bg-surface">
      <p class="flex items-center gap-2 border-b border-success-border bg-success-background px-4 py-2 text-body-1-strong text-success"><CircleCheck class="size-4" aria-hidden="true" />Do</p>
      <ul class="flex flex-col gap-2 p-4 text-body-1 text-secondary">
        <li v-for="d in dos" :key="d" class="flex gap-2"><span class="mt-2 size-1.5 shrink-0 rounded-full bg-success-strong" aria-hidden="true" /><Inline :text="d" /></li>
      </ul>
    </div>
    <div class="rounded-card border border-danger-border bg-surface">
      <p class="flex items-center gap-2 border-b border-danger-border bg-danger-background px-4 py-2 text-body-1-strong text-danger"><CircleX class="size-4" aria-hidden="true" />Don't</p>
      <ul class="flex flex-col gap-2 p-4 text-body-1 text-secondary">
        <li v-for="d in donts" :key="d" class="flex gap-2"><span class="mt-2 size-1.5 shrink-0 rounded-full bg-danger-strong" aria-hidden="true" /><Inline :text="d" /></li>
      </ul>
    </div>
  </div>
</template>
