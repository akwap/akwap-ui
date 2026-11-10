<script setup lang="ts">
import { ref } from 'vue'
import { AkFileAttachment, useToast } from '@/design-system'

const toast = useToast()
const items = ref([
  { name: 'Q3-financial-summary.pdf', size: 1_284_000 },
  { name: 'team-photo.jpg', size: 3_520_000, progress: 62 },
  { name: 'payroll-export.xlsx', size: 14_900_000, error: 'File is larger than 10 MB' },
])
function remove(name: string) {
  items.value = items.value.filter((i) => i.name !== name)
  toast.info('Attachment removed', name)
}
</script>

<template>
  <ul class="flex max-w-md flex-col gap-2">
    <li v-for="f in items" :key="f.name">
      <AkFileAttachment v-bind="f" removable @remove="remove(f.name)" />
    </li>
  </ul>
</template>
