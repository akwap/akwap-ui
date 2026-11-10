<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { CloudUpload } from '@lucide/vue'
import AkFileAttachment from '../data-display/AkFileAttachment.vue'
import { useField } from './fieldContext'
import { useAnnouncer } from '@/composables/useAnnouncer'

export interface UploadItem {
  id: string
  file: File
  progress: number
  error?: string
}

/**
 * AkFileUpload — drag-and-drop zone backed by a real <input type="file">,
 * so it is fully keyboard and screen-reader accessible. Validates type and
 * size and simulates upload progress (swap `simulate` for your uploader).
 */
const props = withDefaults(
  defineProps<{
    modelValue?: UploadItem[]
    accept?: string
    multiple?: boolean
    /** Max size per file in bytes. */
    maxSize?: number
    maxFiles?: number
    disabled?: boolean
    hint?: string
    simulate?: boolean
  }>(),
  { modelValue: () => [], multiple: true, maxSize: 10 * 1024 * 1024, maxFiles: 10, simulate: true },
)
const emit = defineEmits<{ 'update:modelValue': [items: UploadItem[]] }>()
const field = useField()
const uid = useId()
const { announce } = useAnnouncer()
const dragging = ref(false)
const input = ref<HTMLInputElement | null>(null)
const items = computed(() => props.modelValue)

const maxLabel = computed(() => `${Math.round(props.maxSize / 1024 / 1024)} MB`)

function accepts(file: File) {
  if (!props.accept) return true
  return props.accept.split(',').some((rule) => {
    const r = rule.trim().toLowerCase()
    if (r.startsWith('.')) return file.name.toLowerCase().endsWith(r)
    if (r.endsWith('/*')) return file.type.startsWith(r.slice(0, -1))
    return file.type === r
  })
}

function add(files: FileList | null) {
  if (!files || props.disabled) return
  const next = [...items.value]
  for (const file of Array.from(files)) {
    if (next.length >= props.maxFiles) break
    const item: UploadItem = { id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`, file, progress: props.simulate ? 0 : 100 }
    if (!accepts(file)) item.error = 'This file type is not supported'
    else if (file.size > props.maxSize) item.error = `File is larger than ${maxLabel.value}`
    next.push(item)
    if (!item.error && props.simulate) run(item.id)
  }
  emit('update:modelValue', next)
  announce(`${files.length} file${files.length === 1 ? '' : 's'} added`)
  if (input.value) input.value.value = ''
}

function run(id: string) {
  const tick = () => {
    const list = props.modelValue
    const it = list.find((x) => x.id === id)
    if (!it) return
    const progress = Math.min(100, it.progress + 15 + Math.round(Math.random() * 20))
    emit('update:modelValue', list.map((x) => (x.id === id ? { ...x, progress } : x)))
    if (progress < 100) setTimeout(tick, 250)
    else announce(`${it.file.name} uploaded`)
  }
  setTimeout(tick, 200)
}
function remove(id: string) {
  const it = items.value.find((x) => x.id === id)
  emit('update:modelValue', items.value.filter((x) => x.id !== id))
  if (it) announce(`${it.file.name} removed`)
}
function onDrop(e: DragEvent) {
  dragging.value = false
  add(e.dataTransfer?.files ?? null)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      :for="field?.id.value ?? `${uid}-input`"
      class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed px-6 py-8 text-center transition-colors duration-fast focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-line-focus"
      :class="[
        disabled ? 'cursor-not-allowed border-line-disabled bg-control-disabled' : dragging ? 'border-brand-stroke bg-brand-subtle' : 'border-line-strong bg-surface-secondary hover:bg-surface-hover',
        field?.invalid.value ? 'border-danger-strong' : '',
      ]"
      @dragover.prevent="dragging = !disabled"
      @dragleave="dragging = false"
      @drop.prevent="onDrop"
    >
      <span class="flex size-10 items-center justify-center rounded-full bg-brand-subtle text-brand">
        <CloudUpload class="size-5" aria-hidden="true" />
      </span>
      <span class="text-body-1 text-primary">
        <span class="font-semibold text-link underline-offset-2">Choose files</span> or drag and drop
      </span>
      <span class="text-caption-1 text-tertiary">{{ hint ?? `${accept ? accept.replaceAll(',', ', ') + ' · ' : ''}Up to ${maxLabel} each` }}</span>
      <input
        :id="field?.id.value ?? `${uid}-input`"
        ref="input"
        type="file"
        class="sr-only"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        :aria-describedby="field?.describedBy.value"
        @change="add(($event.target as HTMLInputElement).files)"
      />
    </label>
    <ul v-if="items.length" class="flex flex-col gap-2" aria-label="Selected files">
      <li v-for="it in items" :key="it.id">
        <AkFileAttachment :name="it.file.name" :size="it.file.size" :progress="it.progress" :error="it.error" removable @remove="remove(it.id)" />
      </li>
    </ul>
  </div>
</template>
