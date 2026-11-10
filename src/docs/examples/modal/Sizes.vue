<script setup lang="ts">
import { ref } from 'vue'
import { AkButton, AkDialog } from '@/design-system'

const size = ref<'sm' | 'md' | 'lg' | 'xl' | null>(null)
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <AkButton v-for="s in ['sm', 'md', 'lg', 'xl'] as const" :key="s" @click="size = s">Open {{ s }}</AkButton>
  </div>
  <AkDialog :open="!!size" :size="size ?? 'md'" :title="`Dialog size: ${size}`" @update:open="(v) => !v && (size = null)">
    <p class="text-body-1 text-secondary">sm 384px · md 512px · lg 672px · xl 896px. Below 640px every size becomes a full-width bottom sheet.</p>
    <template #footer="{ close }"><AkButton variant="primary" @click="close">Got it</AkButton></template>
  </AkDialog>
</template>
