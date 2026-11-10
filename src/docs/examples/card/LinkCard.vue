<script setup lang="ts">
import { AkCard } from '@/design-system'
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <AkCard to="/docs/foundations/colors" title="Colors" subtitle="Brand ramp, neutrals and status roles">
      The whole card is one link, so keep its content non-interactive.
    </AkCard>
    <AkCard to="/docs/foundations/typography" title="Typography" subtitle="Type ramp from caption to display">
      Hover and focus states come from the card itself.
    </AkCard>
  </div>
</template>
