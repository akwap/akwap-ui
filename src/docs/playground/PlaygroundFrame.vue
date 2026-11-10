<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Save, Users, Wallet, Activity } from '@lucide/vue'
import { AkBadge, AkButton, AkCard, AkCheckbox, AkField, AkInput, AkStatCard, AkSwitch, AkTabs } from '@/design-system'
import { useBrand } from '@/composables/useBrand'
import { brandSeed, defaultState, MESSAGE_TYPE, type PlaygroundState } from './state'

/**
 * Isolated preview rendered inside the playground's iframe. It receives
 * state with postMessage and applies theme, brand and radius to ITS OWN
 * document only — nothing is persisted, so the main site is unaffected.
 * Because it is a real document, responsive utilities react to the frame width.
 */
const state = ref<PlaygroundState>(defaultState())
const email = ref('amina@akwap.example')
const remember = ref(true)
const alerts = ref(true)
const tab = ref('overview')
const { applyBrand } = useBrand()
const root = ref<HTMLElement | null>(null)

function apply(s: PlaygroundState) {
  state.value = s
  email.value = s.input.validation === 'error' ? 'amina@akwap' : 'amina@akwap.example'
  const html = document.documentElement
  html.dataset.theme = s.theme
  applyBrand(brandSeed(s.brand))
  html.style.setProperty('--ak-radius-control', `${s.radiusControl}px`)
  html.style.setProperty('--ak-radius-card', `${s.radiusCard}px`)
  html.style.setProperty('--ak-radius-overlay', `${s.radiusCard}px`)
}
function onMessage(e: MessageEvent) {
  if (e.origin !== window.location.origin || e.data?.type !== MESSAGE_TYPE) return
  apply(e.data.state as PlaygroundState)
}
let ro: ResizeObserver | undefined
onMounted(() => {
  window.addEventListener('message', onMessage)
  window.parent?.postMessage({ type: `${MESSAGE_TYPE}:ready` }, window.location.origin)
  ro = new ResizeObserver(() => window.parent?.postMessage({ type: `${MESSAGE_TYPE}:height`, height: root.value?.scrollHeight ?? 0 }, window.location.origin))
  if (root.value) ro.observe(root.value)
})
onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  ro?.disconnect()
})
</script>

<template>
  <main id="main" ref="root" tabindex="-1" class="min-h-dvh bg-background p-4 outline-none sm:p-6">
    <div class="mx-auto flex max-w-5xl flex-col gap-6">
      <section aria-labelledby="pg-controls" class="rounded-card border border-line-subtle bg-surface p-4 sm:p-card">
        <h1 id="pg-controls" class="text-subtitle-1 text-primary">Your configuration</h1>
        <div class="mt-4 flex flex-col gap-4">
          <AkField
            :label="state.input.label"
            :size="state.input.size"
            :disabled="state.input.disabled"
            :error="state.input.validation === 'error' ? 'Enter a valid email address, like name@company.com' : null"
            :success="state.input.validation === 'success' ? 'This address is available.' : null"
          >
            <AkInput v-model="email" type="email" :size="state.input.size" :success="state.input.validation === 'success'" :disabled="state.input.disabled" />
          </AkField>
          <div class="flex flex-wrap items-center gap-3">
            <AkButton
              :variant="state.button.variant"
              :size="state.button.size"
              :icon="state.button.icon ? Save : undefined"
              :disabled="state.button.disabled"
              :loading="state.button.loading"
              data-testid="pg-button"
            >
              {{ state.button.label || 'Button' }}
            </AkButton>
            <AkButton :size="state.button.size">Cancel</AkButton>
          </div>
        </div>
      </section>

      <section aria-labelledby="pg-sample" class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 id="pg-sample" class="text-subtitle-1 text-primary">Sample screen</h2>
          <AkBadge color="brand" dot>Live</AkBadge>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AkStatCard label="Revenue" value="$296,000" :delta="6.1" :icon="Wallet" />
          <AkStatCard label="Active users" value="2,508" :delta="4.5" :icon="Users" />
          <AkStatCard label="Churn" value="1.8%" :delta="-0.4" :positive-is-good="false" :icon="Activity" />
        </div>
        <AkCard title="Workspace" subtitle="Akwap Cloud · Business plan">
          <AkTabs v-model="tab" label="Workspace" size="sm" :tabs="[{ id: 'overview', label: 'Overview' }, { id: 'members', label: 'Members', badge: 12 }, { id: 'billing', label: 'Billing' }]">
            <template #panel>
              <div class="flex flex-col gap-3 pt-4">
                <AkSwitch v-model="alerts" label="Email me weekly reports" />
                <AkCheckbox v-model="remember" label="Require two-factor authentication" />
              </div>
            </template>
          </AkTabs>
          <template #footer>
            <AkButton :variant="state.button.variant === 'danger' ? 'primary' : state.button.variant" size="sm">Save workspace</AkButton>
            <AkButton size="sm" variant="subtle">Discard</AkButton>
          </template>
        </AkCard>
      </section>
    </div>
  </main>
</template>
