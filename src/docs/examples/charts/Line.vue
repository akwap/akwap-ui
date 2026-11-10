<script setup lang="ts">
import { AkChartCard, AkLineChart } from '@/design-system'
import { months, revenueByMonth, revenuePrevYear } from '@/services/mockData'
import { formatCurrency } from '@/utils/format'
</script>

<template>
  <AkChartCard title="Revenue" description="Last 12 months vs previous year">
    <AkLineChart
      :labels="months"
      :series="[
        { name: 'This year', values: revenueByMonth, slot: 1 },
        { name: 'Last year', values: revenuePrevYear, slot: 2 },
      ]"
      area
      :format="(n) => formatCurrency(n)"
      summary="Revenue grew from $182k in December to $296k in November, ahead of last year every month."
    />
  </AkChartCard>
</template>
