<script setup lang="ts">
import { ref } from 'vue'
import { Trash2 } from '@lucide/vue'
import { AkButton, AkConfirmDialog, useToast } from '@/design-system'

const open = ref(false)
const toast = useToast()

async function remove() {
  await new Promise((r) => setTimeout(r, 900))
  toast.success('Member removed', 'Kwame Mensah no longer has access.')
}
</script>

<template>
  <AkButton variant="danger" :icon="Trash2" @click="open = true">Remove member</AkButton>
  <AkConfirmDialog
    v-model:open="open"
    intent="danger"
    title="Remove Kwame Mensah?"
    description="They will lose access to all projects. You can invite them again later."
    confirm-label="Remove member"
    :on-confirm="remove"
  />
</template>
