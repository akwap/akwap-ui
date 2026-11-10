<script setup lang="ts">
import { AkAccordion, AkAccordionItem } from '@/design-system'
</script>

<template>
  <div class="grid gap-8 md:grid-cols-2">
    <AkAccordion :default-open="['billing']">
      <AkAccordionItem value="billing" title="How does billing work?">You are billed monthly per active seat. Suspended members are free.</AkAccordionItem>
      <AkAccordionItem value="export" title="Can I export my data?">Yes. Every table offers CSV export, and admins can request a full archive.</AkAccordionItem>
      <AkAccordionItem value="sso" title="Do you support SSO?" disabled>Available on the Enterprise plan.</AkAccordionItem>
    </AkAccordion>
    <AkAccordion appearance="separated" multiple>
      <AkAccordionItem value="a" title="Separated, multiple open">Each item is its own card. Several can be open at once.</AkAccordionItem>
      <AkAccordionItem value="b" title="Second item">Headings use h3 by default; set heading-level to match your outline.</AkAccordionItem>
    </AkAccordion>
  </div>
</template>
