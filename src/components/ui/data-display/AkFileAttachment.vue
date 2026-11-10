<script setup lang="ts">
import { computed } from 'vue'
import { File, FileImage, FileSpreadsheet, FileText, FileArchive, X, Download, CircleAlert } from '@lucide/vue'

/** AkFileAttachment — a file chip/row with type icon, size, progress and actions. */
const props = withDefaults(
  defineProps<{
    name: string
    size?: number
    /** 0–100 while uploading. */
    progress?: number
    error?: string
    removable?: boolean
    downloadHref?: string
  }>(),
  {},
)
defineEmits<{ remove: [] }>()

const ext = computed(() => props.name.split('.').pop()?.toLowerCase() ?? '')
const icon = computed(() => {
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext.value)) return FileImage
  if (['xls', 'xlsx', 'csv'].includes(ext.value)) return FileSpreadsheet
  if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(ext.value)) return FileText
  if (['zip', 'rar', '7z', 'gz'].includes(ext.value)) return FileArchive
  return File
})
const sizeLabel = computed(() => {
  if (props.size === undefined) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let n = props.size
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(i ? 1 : 0)} ${units[i]}`
})
const uploading = computed(() => props.progress !== undefined && props.progress < 100 && !props.error)
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-md border bg-surface px-3 py-2"
    :class="error ? 'border-danger-border' : 'border-line-subtle'"
  >
    <span class="flex size-8 shrink-0 items-center justify-center rounded-md" :class="error ? 'bg-danger-background text-danger' : 'bg-brand-subtle text-brand'">
      <CircleAlert v-if="error" class="size-4" aria-hidden="true" />
      <component :is="icon" v-else class="size-4" aria-hidden="true" />
    </span>
    <div class="min-w-0 flex-1">
      <p class="truncate text-body-1 text-primary" :title="name">{{ name }}</p>
      <p v-if="error" class="text-caption-1 text-danger">{{ error }}</p>
      <div v-else-if="uploading" class="mt-1 flex items-center gap-2">
        <div class="h-1 flex-1 overflow-hidden rounded-full bg-surface-tertiary" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100" :aria-label="`Uploading ${name}`">
          <div class="h-full rounded-full bg-brand transition-[width] duration-normal" :style="{ width: `${progress}%` }" />
        </div>
        <span class="text-caption-1 text-tertiary tabular-nums">{{ progress }}%</span>
      </div>
      <p v-else class="text-caption-1 text-tertiary">{{ sizeLabel }}<template v-if="ext"> · {{ ext.toUpperCase() }}</template></p>
    </div>
    <a v-if="downloadHref" :href="downloadHref" download class="inline-flex size-8 items-center justify-center rounded-md text-secondary hover:bg-subtle-hover focus-ring" :aria-label="`Download ${name}`">
      <Download class="size-4" aria-hidden="true" />
    </a>
    <button v-if="removable" type="button" class="inline-flex size-8 items-center justify-center rounded-md text-secondary hover:bg-subtle-hover hover:text-primary focus-ring" :aria-label="`Remove ${name}`" @click="$emit('remove')">
      <X class="size-4" aria-hidden="true" />
    </button>
  </div>
</template>
