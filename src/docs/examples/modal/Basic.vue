<script setup lang="ts">
import { ref } from 'vue'
import { AkButton, AkDialog, AkField, AkInput, useToast } from '@/design-system'

const open = ref(false)
const name = ref('Q4 planning')
const toast = useToast()

function save(close: () => void) {
  toast.success('Project renamed', `Now called “${name.value}”.`)
  close()
}
</script>

<template>
  <AkButton variant="primary" @click="open = true">Rename project</AkButton>
  <AkDialog v-model:open="open" title="Rename project" description="Members will see the new name immediately." initial-focus="input">
    <AkField label="Project name"><AkInput v-model="name" /></AkField>
    <template #footer="{ close }">
      <AkButton @click="close">Cancel</AkButton>
      <AkButton variant="primary" :disabled="!name.trim()" @click="save(close)">Save</AkButton>
    </template>
  </AkDialog>
</template>
