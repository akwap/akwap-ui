<script setup lang="ts">
import { Download, ArrowRight, Pencil, Trash2, Share2 } from '@lucide/vue'
import { AkButton, AkTooltip } from '@/design-system'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <AkButton variant="primary" :icon="Download">Download report</AkButton>
    <AkButton :icon="ArrowRight" icon-position="end">Continue</AkButton>
    <AkTooltip content="Edit" relationship="label">
      <template #default="{ tooltipAttrs }">
        <AkButton variant="subtle" icon-only :icon="Pencil" v-bind="tooltipAttrs" />
      </template>
    </AkTooltip>
    <AkTooltip content="Share" relationship="label">
      <template #default="{ tooltipAttrs }">
        <AkButton variant="subtle" icon-only :icon="Share2" v-bind="tooltipAttrs" />
      </template>
    </AkTooltip>
    <AkTooltip content="Delete" relationship="label">
      <template #default="{ tooltipAttrs }">
        <AkButton variant="subtle" icon-only :icon="Trash2" v-bind="tooltipAttrs" />
      </template>
    </AkTooltip>
  </div>
</template>
