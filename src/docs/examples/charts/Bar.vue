<script setup lang="ts">
import { AkBarChart, AkChartCard } from '@/design-system'
import { transactionsByDay, weekDays } from '@/services/mockData'
</script>

<template>
  <AkChartCard title="Transactions by day" description="This week, by payment method">
    <AkBarChart
      :labels="weekDays"
      :series="[
        { name: 'Mobile money', values: transactionsByDay.mobile, slot: 1 },
        { name: 'Card', values: transactionsByDay.card, slot: 2 },
      ]"
      summary="Mobile money leads card payments every day; both peak on Friday and dip at the weekend."
    />
  </AkChartCard>
</template>
