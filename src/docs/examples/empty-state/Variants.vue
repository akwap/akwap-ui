<script setup lang="ts">
import { ref } from 'vue'
import { AkButton, AkEmptyState, AkSegmentedControl } from '@/design-system'

type V = 'empty' | 'search' | 'error' | 'success' | 'forbidden'
const variant = ref<V>('empty')
const copy: Record<V, { title: string; description: string; action: string }> = {
  empty: { title: 'No projects yet', description: 'Create your first project to start tracking work.', action: 'Create project' },
  search: { title: 'No results for “invoices 2019”', description: 'Try a different keyword or clear filters.', action: 'Clear filters' },
  error: { title: 'We couldn’t load reports', description: 'The server didn’t respond. Your data is safe.', action: 'Try again' },
  success: { title: 'You’re all caught up', description: 'No unread notifications.', action: 'View archive' },
  forbidden: { title: 'You don’t have access', description: 'Ask an admin to grant the Analyst role.', action: 'Request access' },
}
</script>

<template>
  <AkSegmentedControl
    v-model="variant"
    label="Variant"
    size="sm"
    class="mb-6"
    :options="(['empty', 'search', 'error', 'success', 'forbidden'] as const).map((v) => ({ label: v, value: v }))"
  />
  <AkEmptyState :variant="variant" :title="copy[variant].title" :description="copy[variant].description">
    <AkButton variant="primary">{{ copy[variant].action }}</AkButton>
  </AkEmptyState>
</template>
