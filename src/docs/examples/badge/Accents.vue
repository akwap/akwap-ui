<script setup lang="ts">
import { AkBadge, accentFor } from '@/design-system'

// Categories get a stable accent from their name, so "Finance" is always the same colour.
const departments = ['Finance', 'Operations', 'Engineering', 'Sales', 'Support', 'Legal', 'Marketing', 'Design']
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap gap-2">
      <AkBadge v-for="d in departments" :key="d" :color="accentFor(d)">{{ d }}</AkBadge>
    </div>
    <div class="flex flex-wrap gap-2">
      <AkBadge v-for="d in departments" :key="d" :color="accentFor(d)" appearance="filled" shape="rounded">{{ d }}</AkBadge>
    </div>
  </div>
</template>
