<script setup lang="ts">
import { AkAlert } from '@/design-system'
</script>

<template>
  <div class="flex flex-col gap-3">
    <AkAlert intent="info" title="Scheduled maintenance" role="status">Sign-in may be slow on Sunday 02:00–03:00 EAT.</AkAlert>
    <AkAlert intent="success" title="Payment received" role="status">Invoice INV-2041 was paid in full.</AkAlert>
    <AkAlert intent="warning" title="Seats almost full" role="status">You are using 57 of 60 seats.</AkAlert>
    <AkAlert intent="danger" title="Card declined" role="none">Update your payment method to keep your workspace active.</AkAlert>
  </div>
</template>
