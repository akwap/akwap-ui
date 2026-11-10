<script setup lang="ts">
import { AkButton, useToast } from '@/design-system'

const toast = useToast()

function undoable() {
  toast.show({
    title: 'Message archived',
    intent: 'info',
    duration: 8000,
    action: { label: 'Undo', onClick: () => toast.success('Message restored') },
  })
}
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <AkButton @click="toast.success('Changes saved', 'Your settings were updated.')">Success</AkButton>
    <AkButton @click="toast.info('Export started', 'We’ll email you when it’s ready.')">Info</AkButton>
    <AkButton @click="toast.warning('Storage almost full', '92% of 50 GB used.')">Warning</AkButton>
    <AkButton @click="toast.error('Upload failed', 'Check your connection and try again.')">Error</AkButton>
    <AkButton variant="primary" @click="undoable">With action</AkButton>
    <AkButton variant="subtle" @click="toast.show({ title: 'Stays until dismissed', duration: 0 })">Persistent</AkButton>
  </div>
</template>
