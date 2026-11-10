<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ShieldCheck, Zap, Globe } from '@lucide/vue'
import AkLogo from '@/components/shared/AkLogo.vue'
import AkThemeSwitcher from '@/components/shared/AkThemeSwitcher.vue'

/**
 * AuthLayout — split layout: form column + branded panel (hidden on small
 * screens so the form is first and uncluttered on mobile).
 */
const year = 2026
</script>

<template>
  <div class="grid min-h-dvh grid-cols-1 bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
    <div class="flex min-h-dvh flex-col">
      <header class="flex items-center justify-between px-4 py-4 sm:px-8">
        <RouterLink to="/" class="rounded-control focus-ring" aria-label="Akwap home"><AkLogo /></RouterLink>
        <AkThemeSwitcher />
      </header>
      <main id="main" tabindex="-1" class="flex flex-1 items-start justify-center px-4 py-6 outline-none sm:items-center sm:px-8">
        <div class="w-full max-w-[400px]">
          <RouterView />
        </div>
      </main>
      <footer class="flex flex-col items-center gap-2 px-4 py-6 text-caption-1 text-tertiary sm:flex-row sm:justify-between sm:px-8">
        <p>© {{ year }} Akwap Cloud Ltd. All rights reserved.</p>
        <nav aria-label="Legal" class="flex gap-4">
          <RouterLink to="/privacy" class="link text-tertiary">Privacy</RouterLink>
          <RouterLink to="/terms" class="link text-tertiary">Terms</RouterLink>
          <RouterLink to="/contact" class="link text-tertiary">Help</RouterLink>
        </nav>
      </footer>
    </div>

    <aside class="relative hidden overflow-hidden border-l border-line-subtle bg-brand-subtle lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16" aria-label="About Akwap">
      <div
        class="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(var(--ak-color-border-subtle)_1px,transparent_1px),linear-gradient(90deg,var(--ak-color-border-subtle)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]"
        aria-hidden="true"
      />
      <div class="relative max-w-md">
        <p class="text-caption-1-strong tracking-wide text-brand uppercase">Akwap Cloud</p>
        <h2 class="mt-3 text-title-2 text-primary">Every branch, ledger and customer in one calm workspace.</h2>
        <p class="mt-3 text-body-2 text-secondary">Sign in to manage billing, members and reports with the tools your team already knows.</p>
      </div>

      <!-- Product glimpse built from real tokens, not an image -->
      <div class="relative my-10 max-w-md rounded-card border border-line-subtle bg-surface p-5 shadow-elevation-8" aria-hidden="true">
        <div class="flex items-center justify-between">
          <p class="text-caption-1 text-tertiary">Collections this month</p>
          <span class="rounded-full bg-success-background px-2 text-caption-1 font-semibold text-success">+6.1%</span>
        </div>
        <p class="mt-1 text-title-2 text-primary tabular-nums">$296,420</p>
        <div class="mt-4 flex h-20 items-end gap-1.5">
          <span v-for="(h, i) in [38, 52, 46, 60, 58, 72, 66, 80, 76, 88, 84, 96]" :key="i" class="flex-1 rounded-t-[3px] bg-brand" :style="{ height: `${h}%`, opacity: 0.35 + i * 0.055 }" />
        </div>
      </div>

      <ul class="relative grid max-w-md gap-4 text-body-1 text-secondary">
        <li class="flex gap-3"><ShieldCheck class="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />Bank-grade security with two-factor sign-in and audit logs.</li>
        <li class="flex gap-3"><Zap class="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />Real-time collections across cards, bank and mobile money.</li>
        <li class="flex gap-3"><Globe class="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />Multi-currency and multi-branch from day one.</li>
      </ul>
    </aside>
  </div>
</template>
