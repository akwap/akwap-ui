<script setup lang="ts">
import { Target, Eye, HeartHandshake, Scale, Sparkles, Leaf, ArrowRight } from '@lucide/vue'
import { AkAvatar, AkButton, AkCard } from '@/design-system'
import { stats } from '@/services/marketing'

const values = [
  { icon: HeartHandshake, title: 'Serve the front line', body: 'We design for the teller, the field agent and the branch manager first.' },
  { icon: Scale, title: 'Earn trust daily', body: 'Money moves through our product. Accuracy and transparency are non-negotiable.' },
  { icon: Sparkles, title: 'Make it calm', body: 'Fewer clicks, clearer screens, no surprises. Calm software makes for calm teams.' },
  { icon: Leaf, title: 'Build for the long run', body: 'Sustainable growth for us, our customers and the communities they serve.' },
]
const team = [
  { name: 'Nikhil Patel', role: 'Co-founder & CEO' },
  { name: 'Esther Nakamura', role: 'Co-founder & CTO' },
  { name: 'Samuel Owusu', role: 'VP Customer Success' },
  { name: 'Rosa Santos', role: 'Head of Design' },
  { name: 'Yusuf Ibrahim', role: 'Head of Engineering' },
  { name: 'Mercy Wambui', role: 'Head of Compliance' },
  { name: 'Liam Murphy', role: 'Head of Sales' },
  { name: 'Zara Mensah', role: 'Product Lead, Payments' },
]
</script>

<template>
  <section class="border-b border-line-subtle bg-surface">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <p class="text-caption-1-strong tracking-wide text-brand uppercase">About Akwap</p>
      <h1 class="mt-3 max-w-3xl text-large-title text-primary">We build the operating system for businesses that serve their communities</h1>
      <p class="mt-5 max-w-2xl text-body-2 text-secondary">
        Akwap started in 2019 when three engineers spent a month inside a Nairobi SACCO and watched staff juggle five systems to close a single loan. Today more than 2,400 organisations run on Akwap.
      </p>
    </div>
  </section>

  <section class="bg-background py-section" aria-label="Mission and vision">
    <div class="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
      <AkCard padding="lg">
        <Target class="size-6 text-brand" aria-hidden="true" />
        <h2 class="mt-4 text-title-3 text-primary">Our mission</h2>
        <p class="mt-2 text-body-2 text-secondary">Give every growing organisation the reliable, affordable tools that used to be reserved for large banks and telcos.</p>
      </AkCard>
      <AkCard padding="lg">
        <Eye class="size-6 text-brand" aria-hidden="true" />
        <h2 class="mt-4 text-title-3 text-primary">Our vision</h2>
        <p class="mt-2 text-body-2 text-secondary">A world where running the back office is effortless, so people can spend their time on the customers in front of them.</p>
      </AkCard>
    </div>
  </section>

  <section class="border-y border-line-subtle bg-surface py-section" aria-labelledby="values-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 id="values-title" class="text-title-2 text-primary">What we value</h2>
      <ul class="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="v in values" :key="v.title">
          <component :is="v.icon" class="size-6 text-brand" aria-hidden="true" />
          <h3 class="mt-3 text-subtitle-2 text-primary">{{ v.title }}</h3>
          <p class="mt-1 text-body-1 text-secondary">{{ v.body }}</p>
        </li>
      </ul>
    </div>
  </section>

  <section class="bg-background py-section" aria-labelledby="numbers-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 id="numbers-title" class="text-title-2 text-primary">Akwap in numbers</h2>
      <dl class="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div v-for="s in [...stats.slice(0, 3), { value: '180', label: 'people on the team' }]" :key="s.label" class="rounded-card border border-line-subtle bg-surface p-6">
          <dt class="text-body-1 text-secondary">{{ s.label }}</dt>
          <dd class="mt-1 text-title-1 text-primary tabular-nums">{{ s.value }}</dd>
        </div>
      </dl>
    </div>
  </section>

  <section id="team" class="scroll-mt-20 border-t border-line-subtle bg-surface py-section" aria-labelledby="team-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 id="team-title" class="text-title-2 text-primary">Leadership team</h2>
      <p class="mt-2 max-w-2xl text-body-2 text-secondary">A distributed team across Nairobi, Lagos, Kigali and London.</p>
      <ul class="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        <li v-for="p in team" :key="p.name" class="flex flex-col items-center rounded-card border border-line-subtle bg-background p-6 text-center">
          <AkAvatar :name="p.name" :size="72" decorative />
          <p class="mt-3 text-body-1-strong text-primary">{{ p.name }}</p>
          <p class="text-caption-1 text-secondary">{{ p.role }}</p>
        </li>
      </ul>
    </div>
  </section>

  <section class="bg-background py-section">
    <div class="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
      <div>
        <h2 class="text-title-3 text-primary">We're hiring across engineering, design and support</h2>
        <p class="mt-1 text-body-1 text-secondary">Remote-friendly roles in six countries.</p>
      </div>
      <div class="flex gap-2">
        <AkButton to="/contact" variant="primary" :icon="ArrowRight" icon-position="end">Get in touch</AkButton>
        <AkButton to="/auth/register">Try Akwap</AkButton>
      </div>
    </div>
  </section>
</template>
