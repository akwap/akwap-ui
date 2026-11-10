<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, Copy, Download, Pencil, Trash2 } from '@lucide/vue'
import { AkButton, AkMenu, useToast, type MenuItem } from '@/design-system'

const toast = useToast()
const showArchived = ref(false)
const items = (): MenuItem[] => [
  { header: true, label: 'Report' },
  { label: 'Rename', icon: Pencil, shortcut: 'F2', onSelect: () => toast.info('Rename') },
  { label: 'Duplicate', icon: Copy, onSelect: () => toast.info('Duplicated') },
  { label: 'Export CSV', icon: Download, description: 'Includes all columns', onSelect: () => toast.success('Export started') },
  { divider: true },
  { label: 'Show archived', checked: showArchived.value, onSelect: () => (showArchived.value = !showArchived.value) },
  { label: 'Locked action', disabled: true },
  { divider: true },
  { label: 'Delete', icon: Trash2, danger: true, onSelect: () => toast.error('Deleted') },
]
</script>

<template>
  <AkMenu :items="items()" label="Report actions">
    <template #trigger="{ attrs }">
      <AkButton :icon="ChevronDown" icon-position="end" v-bind="attrs">Actions</AkButton>
    </template>
  </AkMenu>
  <p class="mt-3 text-caption-1 text-secondary">Show archived: {{ showArchived ? 'on' : 'off' }}</p>
</template>
