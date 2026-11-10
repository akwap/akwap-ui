<script setup lang="ts">
import { ref } from 'vue'
import AkDialog from './AkDialog.vue'
import AkButton from '../buttons/AkButton.vue'

/**
 * AkConfirmDialog — asks the user to confirm a consequential action.
 * Uses role="alertdialog", focuses the safe (cancel) action first, and shows
 * a loading state while an async `onConfirm` runs.
 */
const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    intent?: 'primary' | 'danger'
    onConfirm?: () => void | Promise<void>
  }>(),
  { confirmLabel: 'Confirm', cancelLabel: 'Cancel', intent: 'primary' },
)
// `onConfirm` is a prop (so it can be awaited); `@confirm` in a template binds
// to the same prop. Do not also emit 'confirm', or the handler runs twice.
const emit = defineEmits<{ 'update:open': [open: boolean]; cancel: [] }>()
const busy = ref(false)

async function confirm() {
  busy.value = true
  try {
    await props.onConfirm?.()
    emit('update:open', false)
  } finally {
    busy.value = false
  }
}
function cancel() {
  emit('cancel')
  emit('update:open', false)
}
</script>

<template>
  <AkDialog
    :open="open"
    :title="title"
    :description="description"
    size="sm"
    role="alertdialog"
    :persistent="busy"
    initial-focus="[data-cancel]"
    @update:open="(v) => !v && cancel()"
  >
    <slot />
    <template #footer>
      <AkButton data-cancel :disabled="busy" @click="cancel">{{ cancelLabel }}</AkButton>
      <AkButton :variant="intent" :loading="busy" @click="confirm">{{ confirmLabel }}</AkButton>
    </template>
  </AkDialog>
</template>
