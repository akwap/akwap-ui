<script setup lang="ts">
import { ref } from 'vue'
import { AkField, AkFileUpload } from '@/design-system'
import type { UploadItem } from '@/components/ui/forms/AkFileUpload.vue'

const files = ref<UploadItem[]>([])
</script>

<template>
  <AkField label="Attachments" class="max-w-lg">
    <AkFileUpload v-model="files" accept=".pdf,.png,.jpg" :max-size="5 * 1024 * 1024" :max-files="3" hint="PDF, PNG or JPG up to 5 MB. Max 3 files." />
  </AkField>
  <p class="mt-3 text-caption-1 text-secondary">{{ files.length }} file(s) queued. Upload progress is simulated.</p>
</template>
