<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Download, Wallet, Users, Percent, Timer, FileSpreadsheet, FileText } from '@lucide/vue'
import {
  AkBarChart, AkChartCard, AkDataTable, AkDateRangePicker, AkDialog, AkLineChart, AkProgressBar, AkRadioGroup, AkSegmentedControl,
  AkStatCard, AkButton, AkCheckbox, useToast, type Column,
} from '@/design-system'
import PageHeader from '@/components/layout/PageHeader.vue'
import { months, revenueByMonth, revenuePrevYear, userGrowth, activeUsers, TODAY } from '@/services/mockData'
import { formatCompact, formatCurrency } from '@/utils/format'
import { downloadCsv } from '@/utils/csv'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const range = ref<[string | null, string | null]>(['2025-11-11', TODAY])
const compare = ref<'previous' | 'none'>('previous')
const exportOpen = ref(false)
const exportFormat = ref('csv')
const exportSections = ref<string[]>(['kpis', 'revenue', 'users'])
const exporting = ref(false)

watch(() => route.query.export, (v) => {
  if (v) {
    exportOpen.value = true
    router.replace({ query: {} })
  }
}, { immediate: true })

const kpi = [
  { label: 'Total revenue', value: formatCurrency(2_736_000), delta: 14.8, icon: Wallet },
  { label: 'New customers', value: '1,202', delta: 9.3, icon: Users },
  { label: 'Conversion rate', value: '4.6%', delta: 0.7, icon: Percent },
  { label: 'Avg. settlement time', value: '1.8 days', delta: -12.5, icon: Timer, positiveIsGood: false },
]

const perf = [
  { channel: 'Mobile money', revenue: 1_313_000, prev: 1_102_000, share: 48, success: 98.6 },
  { channel: 'Card', revenue: 848_000, prev: 781_000, share: 31, success: 96.1 },
  { channel: 'Bank transfer', revenue: 410_000, prev: 392_000, share: 15, success: 99.2 },
  { channel: 'Cash', revenue: 165_000, prev: 188_000, share: 6, success: 100 },
]
const perfCols: Column<(typeof perf)[number]>[] = [
  { key: 'channel', label: 'Channel', sortable: true },
  { key: 'revenue', label: 'Revenue', sortable: true, align: 'end', format: (v) => formatCurrency(v) },
  { key: 'change', label: 'Change', align: 'end', sortValue: (r) => r.revenue / r.prev },
  { key: 'share', label: 'Share', align: 'end', hideBelow: 'sm', format: (v) => `${v}%` },
  { key: 'success', label: 'Success rate', align: 'end', hideBelow: 'md' },
]
const change = (r: (typeof perf)[number]) => ((r.revenue - r.prev) / r.prev) * 100
const revSeries = computed(() => [{ name: 'This period', values: revenueByMonth }, ...(compare.value === 'previous' ? [{ name: 'Previous period', values: revenuePrevYear }] : [])])

async function runExport() {
  exporting.value = true
  await new Promise((r) => setTimeout(r, 900))
  exporting.value = false
  exportOpen.value = false
  if (exportFormat.value === 'csv') {
    downloadCsv('akwap-analytics.csv', months.map((m, i) => ({ month: m, revenue: revenueByMonth[i], previous: revenuePrevYear[i], users: userGrowth[i], active: activeUsers[i] })))
    toast.success('Export downloaded', 'akwap-analytics.csv')
  } else toast.success('PDF report queued', 'We will email it to you within a few minutes.')
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader title="Analytics" description="Revenue, growth and channel performance across your organisation.">
      <template #actions>
        <AkDateRangePicker v-model="range" :today="TODAY" />
        <AkButton variant="primary" :icon="Download" data-testid="export-button" @click="exportOpen = true">Export</AkButton>
      </template>
    </PageHeader>

    <section aria-label="Key performance indicators" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AkStatCard v-for="k in kpi" :key="k.label" :label="k.label" :value="k.value" :delta="k.delta" :icon="k.icon" :positive-is-good="k.positiveIsGood ?? true" delta-label="vs previous 12 months" />
    </section>

    <AkChartCard id="revenue" title="Revenue" description="Monthly collected revenue" class="scroll-mt-20" :heading-level="2">
      <template #actions>
        <AkSegmentedControl v-model="compare" size="sm" label="Comparison" :options="[{ value: 'previous', label: 'Compare' }, { value: 'none', label: 'No comparison' }]" />
      </template>
      <AkLineChart :labels="months" :series="revSeries" area :height="280" :format="(n) => formatCurrency(n)" summary="Revenue rose steadily from $182K to $296K per month, 23% above the previous period." />
      <template #footer>Comparison period: Nov 2024 – Oct 2025. Figures exclude refunds.</template>
    </AkChartCard>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <AkChartCard title="User growth" description="Registered vs monthly active users" :heading-level="2">
        <AkLineChart :labels="months" :series="[{ name: 'Registered', values: userGrowth }, { name: 'Monthly active', values: activeUsers }]" :height="240" :format="(n) => n.toLocaleString()" summary="Registered users grew from 2,140 to 3,342; monthly active users from 1,610 to 2,508." />
      </AkChartCard>
      <AkChartCard title="Quarterly performance" description="Revenue by quarter, in thousands" :heading-level="2">
        <AkBarChart :labels="['Q1', 'Q2', 'Q3', 'Q4']" :series="[{ name: 'This year', values: [571, 656, 752, 838] }, { name: 'Last year', values: [460, 532, 599, 680] }]" :height="240" :format="(n) => `$${n}K`" summary="Every quarter beat last year; Q4 reached $838K versus $680K." />
      </AkChartCard>
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <section class="xl:col-span-2" aria-labelledby="channel-title">
        <h2 id="channel-title" class="mb-3 text-subtitle-1 text-primary">Channel performance</h2>
        <AkDataTable :columns="perfCols" :rows="perf" row-key="channel" caption="Channel performance" hide-caption min-width="520px">
          <template #cell-channel="{ row }"><span class="font-semibold">{{ row.channel }}</span></template>
          <template #cell-change="{ row }">
            <span :class="change(row) >= 0 ? 'text-success' : 'text-danger'" class="font-semibold tabular-nums">
              {{ change(row) >= 0 ? '▲' : '▼' }} {{ Math.abs(change(row)).toFixed(1) }}%
              <span class="sr-only">{{ change(row) >= 0 ? 'increase' : 'decrease' }}</span>
            </span>
          </template>
          <template #cell-success="{ row }"><span class="tabular-nums">{{ row.success }}%</span></template>
        </AkDataTable>
      </section>
      <AkChartCard title="Goals" description="Annual targets" :heading-level="2">
        <div class="flex flex-col gap-5">
          <AkProgressBar label="Revenue ($3.0M)" :value="2.736" :max="3" show-value :value-text="`${formatCompact(2_736_000)} · 91%`" />
          <AkProgressBar label="Customers (3,500)" :value="3342" :max="3500" show-value value-text="3,342 · 95%" />
          <AkProgressBar label="Settlement under 2 days" :value="100" show-value value-text="Achieved" intent="success" />
        </div>
      </AkChartCard>
    </div>

    <AkDialog v-model:open="exportOpen" title="Export analytics" description="Choose a format and what to include." size="sm">
      <div class="flex flex-col gap-5">
        <AkRadioGroup v-model="exportFormat" label="Format" :options="[{ label: 'CSV spreadsheet', value: 'csv', description: 'Monthly figures, downloads now' }, { label: 'PDF report', value: 'pdf', description: 'Charts and tables, emailed to you' }]" />
        <fieldset class="flex flex-col gap-2">
          <legend class="mb-2 text-body-1-strong text-primary">Include</legend>
          <AkCheckbox v-model="exportSections" value="kpis" label="Key metrics" />
          <AkCheckbox v-model="exportSections" value="revenue" label="Revenue" />
          <AkCheckbox v-model="exportSections" value="users" label="User growth" />
          <AkCheckbox v-model="exportSections" value="channels" label="Channel performance" />
        </fieldset>
      </div>
      <template #footer="{ close }">
        <AkButton @click="close">Cancel</AkButton>
        <AkButton variant="primary" :icon="exportFormat === 'csv' ? FileSpreadsheet : FileText" :loading="exporting" :disabled="!exportSections.length" @click="runExport">Export</AkButton>
      </template>
    </AkDialog>
  </div>
</template>
