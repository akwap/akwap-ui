<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, Check, Play, Quote, Users, Wallet, CircleCheck } from '@lucide/vue'
import { AkAccordion, AkAccordionItem, AkAvatar, AkBadge, AkButton, AkCard, AkLineChart, AkSegmentedControl, AkStatCard, AkDialog } from '@/design-system'
import { features, industries, testimonials, plans, faqs, stats } from '@/services/marketing'
import { months, revenueByMonth, revenuePrevYear, kpis } from '@/services/mockData'
import { formatCompact, formatCurrency } from '@/utils/format'

const billing = ref<'monthly' | 'annual'>('annual')
const demoOpen = ref(false)
</script>

<template>
  <!-- Hero -->
  <section class="relative overflow-hidden border-b border-line-subtle bg-surface">
    <div
      class="pointer-events-none absolute inset-0 [background-image:linear-gradient(var(--ak-color-border-subtle)_1px,transparent_1px),linear-gradient(90deg,var(--ak-color-border-subtle)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      aria-hidden="true"
    />
    <div class="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <AkBadge color="brand" size="lg" class="mb-5">New · Multi-branch analytics</AkBadge>
        <h1 class="text-large-title text-primary sm:text-display">Run your business on one calm platform</h1>
        <p class="mx-auto mt-5 max-w-2xl text-body-2 text-secondary sm:text-subtitle-1 sm:font-normal">
          Akwap brings billing, members, payments and reporting together so your team spends less time reconciling and more time serving customers.
        </p>
        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <AkButton to="/auth/register" variant="primary" size="lg" :icon="ArrowRight" icon-position="end">Start free trial</AkButton>
          <AkButton size="lg" :icon="Play" @click="demoOpen = true">Watch 2-minute tour</AkButton>
        </div>
        <p class="mt-4 text-caption-1 text-tertiary">14-day trial · No credit card · Cancel anytime</p>
      </div>

      <!-- Product showcase built from real components -->
      <div class="mx-auto mt-14 max-w-5xl rounded-xl border border-line-subtle bg-background p-2 shadow-elevation-16 sm:p-3" aria-label="Product preview" role="img">
        <div class="rounded-lg border border-line-subtle bg-surface p-4 sm:p-6" aria-hidden="true" inert>
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="text-subtitle-2 text-primary">Good morning, Amina</p>
              <p class="text-caption-1 text-tertiary">Here's how Akwap Cloud is doing this month.</p>
            </div>
            <AkBadge color="success" dot>All systems normal</AkBadge>
          </div>
          <div class="grid gap-3 sm:grid-cols-3">
            <AkStatCard label="Revenue" :value="formatCurrency(kpis.revenue.value)" :delta="kpis.revenue.delta" :trend="kpis.revenue.trend" :icon="Wallet" />
            <AkStatCard label="Active customers" :value="kpis.customers.value.toLocaleString()" :delta="kpis.customers.delta" :icon="Users" class="max-sm:hidden" />
            <AkStatCard label="Collection rate" value="97.4%" :delta="1.2" :icon="CircleCheck" class="max-sm:hidden" />
          </div>
          <div class="mt-3 hidden rounded-card border border-line-subtle p-4 sm:block">
            <AkLineChart :labels="months" :series="[{ name: 'This year', values: revenueByMonth }, { name: 'Last year', values: revenuePrevYear }]" :height="200" area summary="Revenue preview" :format="(n) => formatCompact(n)" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Industries -->
  <section class="border-b border-line-subtle bg-background" aria-label="Who uses Akwap">
    <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-8 text-body-1 text-secondary sm:px-6 lg:px-8">
      <span class="text-caption-1-strong tracking-wide text-tertiary uppercase">Built for</span>
      <span v-for="i in industries" :key="i.label" class="inline-flex items-center gap-2"><component :is="i.icon" class="size-5 text-tertiary" aria-hidden="true" />{{ i.label }}</span>
    </div>
  </section>

  <!-- Features -->
  <section id="features" class="scroll-mt-20 bg-background py-section" aria-labelledby="features-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl">
        <p class="text-caption-1-strong tracking-wide text-brand uppercase">Features</p>
        <h2 id="features-title" class="mt-2 text-title-2 text-primary sm:text-title-1">Everything operations needs, nothing it doesn't</h2>
        <p class="mt-3 text-body-2 text-secondary">Purpose-built modules that share one data model, so numbers always agree.</p>
      </div>
      <ul class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="f in features" :key="f.title">
          <AkCard class="h-full">
            <span class="flex size-10 items-center justify-center rounded-md bg-brand-subtle text-brand"><component :is="f.icon" class="size-5" aria-hidden="true" /></span>
            <h3 class="mt-4 text-subtitle-2 text-primary">{{ f.title }}</h3>
            <p class="mt-1 text-body-1 text-secondary">{{ f.body }}</p>
          </AkCard>
        </li>
      </ul>
    </div>
  </section>

  <!-- Benefits -->
  <section class="border-y border-line-subtle bg-surface py-section" aria-labelledby="benefits-title">
    <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <h2 id="benefits-title" class="text-title-2 text-primary">Close the books faster, with fewer surprises</h2>
        <p class="mt-3 text-body-2 text-secondary">Every payment is matched to an invoice the moment it arrives. Exceptions surface automatically, so your team only touches what needs attention.</p>
        <ul class="mt-6 flex flex-col gap-3">
          <li v-for="b in ['Automatic reconciliation for 30+ payment providers', 'Approval workflows for refunds, limits and write-offs', 'Exports your auditors and accountants already accept', 'Role-based access down to the branch and field']" :key="b" class="flex gap-3 text-body-1 text-primary">
            <span class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success-background text-success"><Check class="size-3.5" aria-hidden="true" /></span>{{ b }}
          </li>
        </ul>
        <AkButton to="/dashboard" class="mt-8" :icon="ArrowRight" icon-position="end">Explore the live demo</AkButton>
      </div>
      <dl class="grid grid-cols-2 gap-4">
        <div v-for="s in stats" :key="s.label" class="rounded-card border border-line-subtle bg-background p-6">
          <dt class="text-body-1 text-secondary">{{ s.label }}</dt>
          <dd class="mt-1 text-title-1 text-primary tabular-nums">{{ s.value }}</dd>
        </div>
      </dl>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="bg-background py-section" aria-labelledby="testimonials-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 id="testimonials-title" class="max-w-2xl text-title-2 text-primary">Teams that switched aren't going back</h2>
      <ul class="mt-10 grid gap-4 md:grid-cols-3">
        <li v-for="t in testimonials" :key="t.name">
          <figure class="flex h-full flex-col rounded-card border border-line-subtle bg-surface p-6">
            <Quote class="size-6 text-brand" aria-hidden="true" />
            <blockquote class="mt-3 flex-1 text-body-2 text-primary">“{{ t.quote }}”</blockquote>
            <figcaption class="mt-6 flex items-center gap-3">
              <AkAvatar :name="t.name" :size="40" decorative />
              <span><span class="block text-body-1-strong text-primary">{{ t.name }}</span><span class="block text-caption-1 text-secondary">{{ t.role }}</span></span>
            </figcaption>
          </figure>
        </li>
      </ul>
    </div>
  </section>

  <!-- Pricing -->
  <section id="pricing" class="scroll-mt-20 border-y border-line-subtle bg-surface py-section" aria-labelledby="pricing-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div class="max-w-xl">
          <p class="text-caption-1-strong tracking-wide text-brand uppercase">Pricing</p>
          <h2 id="pricing-title" class="mt-2 text-title-2 text-primary">Simple pricing per user</h2>
          <p class="mt-2 text-body-2 text-secondary">All plans include unlimited customers and transactions.</p>
        </div>
        <AkSegmentedControl v-model="billing" label="Billing period" :options="[{ value: 'monthly', label: 'Monthly' }, { value: 'annual', label: 'Annual (save 17%)' }]" />
      </div>
      <ul class="mt-10 grid gap-4 lg:grid-cols-3">
        <li v-for="plan in plans" :key="plan.name">
          <div class="relative flex h-full flex-col rounded-card border bg-background p-6" :class="plan.featured ? 'border-brand-stroke ring-1 ring-brand-stroke' : 'border-line-subtle'">
            <AkBadge v-if="plan.featured" color="brand" appearance="filled" class="absolute -top-2.5 left-6">Most popular</AkBadge>
            <h3 class="text-subtitle-1 text-primary">{{ plan.name }}</h3>
            <p class="mt-1 text-body-1 text-secondary">{{ plan.description }}</p>
            <p class="mt-6 flex items-baseline gap-1">
              <template v-if="plan.monthly">
                <span class="text-title-1 text-primary tabular-nums">${{ billing === 'annual' ? plan.annual : plan.monthly }}</span>
                <span class="text-body-1 text-secondary">per user / month</span>
              </template>
              <span v-else class="text-title-1 text-primary">Custom</span>
            </p>
            <ul class="mt-6 flex flex-1 flex-col gap-2.5">
              <li v-for="f in plan.features" :key="f" class="flex gap-2 text-body-1 text-primary"><Check class="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />{{ f }}</li>
            </ul>
            <AkButton :to="plan.monthly ? '/auth/register' : '/contact'" :variant="plan.featured ? 'primary' : 'secondary'" size="lg" block class="mt-8">{{ plan.cta }}</AkButton>
          </div>
        </li>
      </ul>
    </div>
  </section>

  <!-- FAQ -->
  <section id="faq" class="scroll-mt-20 bg-background py-section" aria-labelledby="faq-title">
    <div class="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_2fr] lg:px-8">
      <div>
        <h2 id="faq-title" class="text-title-2 text-primary">Frequently asked questions</h2>
        <p class="mt-3 text-body-1 text-secondary">Can't find what you need? <RouterLink to="/contact" class="link">Contact our team</RouterLink>.</p>
      </div>
      <AkAccordion :default-open="['0']">
        <AkAccordionItem v-for="(f, i) in faqs" :key="f.q" :value="String(i)" :title="f.q">{{ f.a }}</AkAccordionItem>
      </AkAccordion>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-background pb-section" aria-labelledby="cta-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-start justify-between gap-6 rounded-xl bg-brand px-6 py-10 text-on-brand sm:px-10 md:flex-row md:items-center">
        <div>
          <h2 id="cta-title" class="text-title-2 text-on-brand">Ready to bring everything together?</h2>
          <p class="mt-2 text-body-2 opacity-90">Set up your workspace in minutes. Import customers when you're ready.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <AkButton to="/auth/register" size="lg" class="border-transparent">Start free trial</AkButton>
          <AkButton to="/contact" size="lg" variant="outline" class="border-on-brand text-on-brand hover:!bg-on-brand/10">Talk to sales</AkButton>
        </div>
      </div>
    </div>
  </section>

  <AkDialog v-model:open="demoOpen" title="Product tour" description="A quick look at billing, members and analytics." size="lg">
    <div class="flex aspect-video items-center justify-center rounded-md border border-line-subtle bg-surface-tertiary text-center">
      <div class="px-6">
        <Play class="mx-auto size-10 text-brand" aria-hidden="true" />
        <p class="mt-2 text-body-1 text-secondary">The video player is a placeholder in this demo. Explore the live dashboard instead.</p>
      </div>
    </div>
    <template #footer="{ close }">
      <AkButton @click="close">Close</AkButton>
      <AkButton variant="primary" to="/dashboard" @click="close">Open live demo</AkButton>
    </template>
  </AkDialog>
</template>
