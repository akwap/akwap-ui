<script setup lang="ts">
import { AkChartCard, AkDonutChart, AkStatCard } from '@/design-system'
import { DollarSign } from '@lucide/vue'
import { paymentMix } from '@/services/mockData'
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2">
    <AkChartCard title="Payment methods" description="Share of transactions">
      <AkDonutChart :items="paymentMix" center-label="Payments" summary="Mobile money is the most used payment method at 48%, followed by card at 31%." />
    </AkChartCard>
    <AkStatCard label="Monthly revenue" value="$296,000" :delta="6.1" :icon="DollarSign" :trend="[232, 248, 241, 263, 279, 296]" />
  </div>
</template>
