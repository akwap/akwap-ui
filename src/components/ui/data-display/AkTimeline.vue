<script setup lang="ts">
import type { Component } from 'vue'

export interface TimelineItem {
  id: string | number
  title: string
  description?: string
  time?: string
  icon?: Component
  intent?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral'
}

/** AkTimeline — chronological sequence of events. */
withDefaults(defineProps<{ items: TimelineItem[]; dense?: boolean }>(), {})
const dotCls = {
  brand: 'bg-brand-subtle text-brand',
  success: 'bg-success-background text-success',
  warning: 'bg-warning-background text-warning',
  danger: 'bg-danger-background text-danger',
  neutral: 'bg-surface-tertiary text-secondary',
}
</script>

<template>
  <ol class="relative">
    <li v-for="(item, i) in items" :key="item.id" class="relative flex gap-3" :class="dense ? 'pb-3' : 'pb-5'">
      <span v-if="i < items.length - 1" class="absolute top-8 bottom-0 left-[15px] w-px bg-line-subtle" aria-hidden="true" />
      <span class="relative flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-surface" :class="dotCls[item.intent ?? 'neutral']" aria-hidden="true">
        <component :is="item.icon" v-if="item.icon" class="size-4" />
        <span v-else class="size-2 rounded-full bg-current" />
      </span>
      <div class="min-w-0 flex-1 pt-1">
        <div class="flex flex-wrap items-baseline justify-between gap-x-3">
          <p class="text-body-1-strong text-primary">{{ item.title }}</p>
          <time v-if="item.time" class="text-caption-1 text-tertiary">{{ item.time }}</time>
        </div>
        <p v-if="item.description" class="mt-0.5 text-body-1 text-secondary">{{ item.description }}</p>
        <slot :item="item" />
      </div>
    </li>
  </ol>
</template>
