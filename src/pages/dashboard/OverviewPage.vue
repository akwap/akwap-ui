<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Wallet, Users, ArrowLeftRight, TrendingDown, UserPlus, FileText, Download, Send, ArrowRight, Bell, MoreHorizontal, RefreshCw } from '@lucide/vue'
import {
  AkActivityFeed, AkBadge, AkBarChart, AkButton, AkCard, AkChartCard, AkDataTable, AkDateRangePicker, AkDonutChart, AkLineChart,
  AkMenu, AkProgressBar, AkSegmentedControl, AkStatCard, useToast, type Column, type SortState,
} from '@/design-system'
import { kpis, months, revenueByMonth, revenuePrevYear, weekDays, transactionsByDay, paymentMix, transactions, recentActivity, TODAY } from '@/services/mockData'
import { useNotifications } from '@/stores/notifications'
import { session } from '@/stores/session'
import { formatCurrency, formatRelative } from '@/utils/format'
import type { Transaction } from '@/types'

const router = useRouter()
const toast = useToast()
const { items: notes, markRead } = useNotifications()
const range = ref<[string | null, string | null]>(['2026-10-12', TODAY])
const revenueView = ref('12m')
const refreshing = ref(false)
const sort = ref<SortState | null>({ key: 'date', direction: 'desc' })

const revenueSeries = computed(() => {
  const n = revenueView.value === '6m' ? 6 : 12
  return { labels: months.slice(-n), series: [{ name: 'This year', values: revenueByMonth.slice(-n) }, { name: 'Last year', values: revenuePrevYear.slice(-n) }] }
})
const columns: Column<Transaction>[] = [
  { key: 'id', label: 'Transaction', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'method', label: 'Method', hideBelow: 'md' },
  { key: 'date', label: 'Date', sortable: true, hideBelow: 'lg', format: (v) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(v)) },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount', sortable: true, align: 'end', format: (v) => formatCurrency(v) },
]
const statusColor = { completed: 'success', pending: 'warning', failed: 'danger', refunded: 'neutral' } as const
const greeting = computed(() => 'Good morning')

async function refresh() {
  refreshing.value = true
  await new Promise((r) => setTimeout(r, 800))
  refreshing.value = false
  toast.success('Dashboard updated', 'Figures refreshed a moment ago.')
}
const quickActions = [
  { label: 'Invite user', icon: UserPlus, run: () => router.push({ path: '/dashboard/users', query: { invite: '1' } }) },
  { label: 'Create invoice', icon: FileText, run: () => toast.info('Invoice drafted', 'INV-2026-1121 was created as a draft.') },
  { label: 'Send reminders', icon: Send, run: () => toast.success('Reminders sent', '14 customers with overdue invoices were notified.') },
  { label: 'Export report', icon: Download, run: () => router.push({ path: '/dashboard/analytics', query: { export: '1' } }) },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-title-3 text-primary sm:text-title-2">{{ greeting }}, {{ session.user.name.split(' ')[0] }}</h1>
        <p class="mt-1 text-body-1 text-secondary">Here's what's happening across Akwap Cloud today, Tuesday 10 November.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <AkDateRangePicker v-model="range" :today="TODAY" />
        <AkButton :icon="RefreshCw" :loading="refreshing" aria-label="Refresh data" icon-only @click="refresh">Refresh</AkButton>
      </div>
    </div>

    <section aria-label="Key metrics" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AkStatCard label="Revenue" :value="formatCurrency(kpis.revenue.value)" :delta="kpis.revenue.delta" :trend="kpis.revenue.trend" :icon="Wallet" :loading="refreshing" />
      <AkStatCard label="Active customers" :value="kpis.customers.value.toLocaleString()" :delta="kpis.customers.delta" :trend="kpis.customers.trend" :icon="Users" :loading="refreshing" />
      <AkStatCard label="Transactions" :value="kpis.transactions.value.toLocaleString()" :delta="kpis.transactions.delta" :trend="kpis.transactions.trend" :icon="ArrowLeftRight" :loading="refreshing" />
      <AkStatCard label="Churn rate" :value="`${kpis.churn.value}%`" :delta="kpis.churn.delta" :positive-is-good="false" :trend="kpis.churn.trend" :icon="TrendingDown" :loading="refreshing" />
    </section>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <AkChartCard title="Revenue overview" description="Monthly collected revenue, compared with last year" class="xl:col-span-2" :heading-level="2">
        <template #actions>
          <AkSegmentedControl v-model="revenueView" size="sm" label="Revenue period" :options="[{ value: '6m', label: '6 months' }, { value: '12m', label: '12 months' }]" />
        </template>
        <AkLineChart :labels="revenueSeries.labels" :series="revenueSeries.series" area :height="260" :format="(n) => formatCurrency(n)" summary="Revenue grew from $182K in December to $296K in November, about 23% above last year." />
      </AkChartCard>
      <AkChartCard title="Payment mix" description="Share of transactions this month" :heading-level="2">
        <AkDonutChart :items="paymentMix" center-label="of volume" :format="(n) => `${n}%`" :show-percent="false" summary="Mobile money 48%, card 31%, bank transfer 15%, cash 6%." />
      </AkChartCard>
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <AkChartCard title="Transactions this week" description="Count by payment channel" class="xl:col-span-2" :heading-level="2">
        <AkBarChart :labels="weekDays" :series="[{ name: 'Mobile money', values: transactionsByDay.mobile }, { name: 'Card', values: transactionsByDay.card }]" :height="240" summary="Mobile money leads every day, peaking at 744 on Friday; card peaks at 520 on Friday." />
      </AkChartCard>
      <AkCard title="Performance" subtitle="Progress towards November targets" :heading-level="2">
        <div class="flex flex-col gap-5">
          <AkProgressBar label="Revenue target" :value="296" :max="320" show-value value-text="$296K of $320K" />
          <AkProgressBar label="New customers" :value="162" :max="200" show-value value-text="162 of 200" />
          <AkProgressBar label="Collection rate" :value="97.4" show-value value-text="97.4% (goal 98%)" intent="success" />
          <AkProgressBar label="Failed payments" :value="2.6" :max="5" show-value value-text="2.6% (limit 5%)" intent="warning" />
        </div>
      </AkCard>
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <section id="transactions" class="scroll-mt-20 xl:col-span-2" aria-labelledby="tx-title">
        <div class="mb-3 flex items-center justify-between">
          <h2 id="tx-title" class="text-subtitle-1 text-primary">Recent transactions</h2>
          <AkButton variant="subtle" size="sm" :icon="ArrowRight" icon-position="end" to="/dashboard/analytics">View report</AkButton>
        </div>
        <AkDataTable v-model:sort="sort" :columns="columns" :rows="transactions.slice(0, 8)" caption="Recent transactions" hide-caption>
          <template #cell-id="{ row }"><span class="font-semibold">{{ row.id }}</span></template>
          <template #cell-customer="{ row }">
            <span class="block">{{ row.customer }}</span>
            <span class="block text-caption-1 text-tertiary lg:hidden">{{ formatRelative(row.date) }}</span>
          </template>
          <template #cell-status="{ row }">
            <AkBadge :color="statusColor[row.status as Transaction['status']]" dot class="capitalize">{{ row.status }}</AkBadge>
          </template>
        </AkDataTable>
      </section>
      <div class="flex flex-col gap-4">
        <AkCard title="Quick actions" :heading-level="2">
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="a in quickActions"
              :key="a.label"
              type="button"
              class="flex flex-col items-start gap-2 rounded-md border border-line-subtle p-3 text-left text-body-1 text-primary transition-colors hover:border-line hover:bg-surface-hover focus-ring"
              @click="a.run"
            >
              <component :is="a.icon" class="size-5 text-brand" aria-hidden="true" />{{ a.label }}
            </button>
          </div>
        </AkCard>
        <AkCard title="Notifications" :heading-level="2">
          <template #actions>
            <AkMenu :items="[{ label: 'View all', icon: Bell, onSelect: () => router.push('/dashboard/notifications') }, { label: 'Notification settings', onSelect: () => router.push('/account/settings') }]" placement="bottom-end">
              <template #trigger="{ attrs }"><AkButton v-bind="attrs" size="sm" variant="subtle" icon-only :icon="MoreHorizontal" aria-label="Notification options">Options</AkButton></template>
            </AkMenu>
          </template>
          <ul class="flex flex-col gap-1">
            <li v-for="n in notes.slice(0, 4)" :key="n.id">
              <button type="button" class="-mx-2 flex w-[calc(100%+16px)] gap-2 rounded-md px-2 py-2 text-left hover:bg-subtle-hover focus-ring" @click="markRead(n.id), n.link && router.push(n.link)">
                <span class="mt-1.5 size-2 shrink-0 rounded-full" :class="n.read ? 'bg-transparent' : 'bg-brand'" aria-hidden="true" />
                <span class="min-w-0">
                  <span class="block truncate text-body-1" :class="n.read ? 'text-secondary' : 'font-semibold text-primary'">{{ n.title }}<span v-if="!n.read" class="sr-only"> (unread)</span></span>
                  <span class="block text-caption-1 text-tertiary">{{ formatRelative(n.time) }}</span>
                </span>
              </button>
            </li>
          </ul>
        </AkCard>
      </div>
    </div>

    <AkCard title="Recent activity" subtitle="Changes across your workspace" :heading-level="2">
      <template #actions><AkButton size="sm" variant="subtle" to="/dashboard/activity">View all</AkButton></template>
      <AkActivityFeed :items="recentActivity" class="sm:grid sm:grid-cols-2 sm:gap-x-8" />
    </AkCard>
  </div>
</template>
