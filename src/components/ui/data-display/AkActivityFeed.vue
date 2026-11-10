<script setup lang="ts">
import AkAvatar from './AkAvatar.vue'
import { formatRelative, formatDateTime } from '@/utils/format'

export interface ActivityEntry {
  id: string | number
  actor: string
  action: string
  target?: string
  time: string
  detail?: string
}

/** AkActivityFeed — who did what, when. Uses <time> for machine-readable dates. */
withDefaults(defineProps<{ items: ActivityEntry[]; compact?: boolean }>(), {})
</script>

<template>
  <ul class="flex flex-col" :class="compact ? 'gap-3' : 'gap-4'">
    <li v-for="a in items" :key="a.id" class="flex gap-3">
      <AkAvatar :name="a.actor" :size="compact ? 28 : 32" decorative />
      <div class="min-w-0 flex-1">
        <p class="text-body-1 text-secondary">
          <span class="font-semibold text-primary">{{ a.actor }}</span> {{ a.action }}
          <span v-if="a.target" class="font-semibold text-primary">{{ a.target }}</span>
        </p>
        <p v-if="a.detail" class="mt-0.5 truncate text-caption-1 text-secondary">{{ a.detail }}</p>
        <time :datetime="a.time" :title="formatDateTime(a.time)" class="text-caption-1 text-tertiary">{{ formatRelative(a.time) }}</time>
      </div>
    </li>
  </ul>
</template>
