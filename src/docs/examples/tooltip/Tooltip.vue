<script setup lang="ts">
import { Info, Settings } from '@lucide/vue'
import { AkButton, AkTooltip } from '@/design-system'
</script>

<template>
  <div class="flex flex-wrap items-center gap-6">
    <!-- relationship="label": the tooltip IS the button's accessible name -->
    <AkTooltip content="Settings" relationship="label">
      <template #default="{ tooltipAttrs }">
        <AkButton variant="subtle" icon-only :icon="Settings" v-bind="tooltipAttrs" />
      </template>
    </AkTooltip>

    <!-- relationship="description": extra hint read after the name -->
    <AkTooltip content="Only owners can transfer billing" placement="bottom">
      <template #default="{ tooltipAttrs }">
        <AkButton v-bind="tooltipAttrs">Transfer billing</AkButton>
      </template>
    </AkTooltip>

    <AkTooltip content="Monthly recurring revenue, excluding tax" placement="right">
      <template #default="{ tooltipAttrs }">
        <button type="button" class="inline-flex items-center gap-1 rounded-sm text-body-1 text-secondary focus-ring" v-bind="tooltipAttrs">
          MRR <Info class="size-4" aria-hidden="true" />
        </button>
      </template>
    </AkTooltip>
  </div>
</template>
