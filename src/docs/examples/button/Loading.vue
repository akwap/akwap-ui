<script setup lang="ts">
import { ref } from 'vue'
import { Save } from '@lucide/vue'
import { AkButton, useToast } from '@/design-system'

const saving = ref(false)
const toast = useToast()

function save() {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    toast.success('Changes saved', 'Your profile has been updated.')
  }, 1500)
}
</script>

<template>
  <AkButton variant="primary" :icon="Save" :loading="saving" loading-text="Saving changes" @click="save">
    {{ saving ? 'Saving…' : 'Save changes' }}
  </AkButton>
</template>
