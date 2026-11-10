<script setup lang="ts">
import { AkButton, AkIcon, AkTooltip, icons } from '@/design-system'
</script>

<template>
  <div class="flex flex-wrap items-center gap-6">
    <!-- Decorative: visible text already says it -->
    <span class="inline-flex items-center gap-2 text-body-1 text-primary">
      <AkIcon name="secure" color="success" size="sm" /> Two-step sign-in is on
    </span>

    <!-- Meaningful on its own: give it a label -->
    <span class="inline-flex items-center gap-2 text-body-1 text-primary">
      Invoice INV-2041 <AkIcon name="locked" size="sm" color="secondary" label="Locked" />
    </span>

    <!-- Icon-only button: the tooltip labels the button; the icon stays decorative -->
    <AkTooltip content="Print invoice" relationship="label">
      <template #default="{ tooltipAttrs }">
        <AkButton variant="subtle" icon-only :icon="icons.print" v-bind="tooltipAttrs" />
      </template>
    </AkTooltip>
  </div>
</template>
