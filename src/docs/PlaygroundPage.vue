<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RotateCcw, Sun, Moon, Contrast, Globe } from '@lucide/vue'
import { AkButton, AkField, AkInput, AkSegmentedControl, AkSelect, AkSwitch, AkTabs, useBrand, useToast } from '@/design-system'
import DocHeader from './shared/DocHeader.vue'
import CodeBlock from './shared/CodeBlock.vue'
import { defaultState, generateCode, MESSAGE_TYPE, type PlaygroundState } from './playground/state'

/**
 * Component playground. Controls on the left drive an isolated preview
 * (an iframe of /playground-frame), so theme, brand and radius can be tried
 * without changing the rest of the site, and responsive widths are real.
 */
const state = ref<PlaygroundState>(defaultState())
const frame = ref<HTMLIFrameElement | null>(null)
const frameHeight = ref(720)
const width = ref<'320' | '375' | '768' | '1024' | 'full'>('full')
const codeTab = ref('vue')
const toast = useToast()
const { setBrandHex, resetBrand } = useBrand()

const presets = [
  { name: 'Ocean', hex: '#2d6bc4' },
  { name: 'Teal', hex: '#0f7b6c' },
  { name: 'Violet', hex: '#6b4fbb' },
  { name: 'Forest', hex: '#2f7d32' },
  { name: 'Clay', hex: '#b5542d' },
  { name: 'Berry', hex: '#b0306a' },
]
const variants = ['primary', 'secondary', 'outline', 'subtle', 'transparent', 'danger', 'link'] as const

function send() {
  frame.value?.contentWindow?.postMessage({ type: MESSAGE_TYPE, state: JSON.parse(JSON.stringify(state.value)) }, window.location.origin)
}
watch(state, send, { deep: true })
function onMessage(e: MessageEvent) {
  if (e.origin !== window.location.origin) return
  if (e.data?.type === `${MESSAGE_TYPE}:ready`) send()
  if (e.data?.type === `${MESSAGE_TYPE}:height` && typeof e.data.height === 'number') frameHeight.value = Math.max(480, e.data.height)
}
onMounted(() => window.addEventListener('message', onMessage))
onBeforeUnmount(() => window.removeEventListener('message', onMessage))

const code = computed(() => generateCode(state.value))
const validHex = computed(() => /^#[0-9a-f]{6}$/i.test(state.value.brand))

function reset() {
  state.value = defaultState()
  width.value = 'full'
}
function applyToSite() {
  setBrandHex(state.value.brand)
  document.documentElement.style.setProperty('--ak-radius-control', `${state.value.radiusControl}px`)
  document.documentElement.style.setProperty('--ak-radius-card', `${state.value.radiusCard}px`)
  document.documentElement.style.setProperty('--ak-radius-overlay', `${state.value.radiusCard}px`)
  toast.success('Applied to the whole site', 'Brand colour saved in this browser; radius applies until you reload.')
}
function resetSite() {
  resetBrand()
  for (const p of ['--ak-radius-control', '--ak-radius-card', '--ak-radius-overlay']) document.documentElement.style.removeProperty(p)
  toast.info('Site restored to the default brand')
}
</script>

<template>
  <div>
    <DocHeader eyebrow="Playground" title="Component playground" lead="Change the theme, brand colour, corner radius, button and input options. The preview updates live and the code below is generated from your choices." />

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
      <form class="flex flex-col gap-6 rounded-card border border-line-subtle bg-surface p-4 xl:sticky xl:top-20 xl:max-h-[calc(100dvh-104px)] xl:overflow-y-auto" aria-label="Playground controls" @submit.prevent>
        <fieldset class="flex flex-col gap-3">
          <legend class="mb-1 text-subtitle-2 text-primary">Theme</legend>
          <AkSegmentedControl
            v-model="state.theme"
            label="Preview theme"
            block
            size="sm"
            data-testid="pg-theme"
            :options="[
              { label: 'Light', value: 'light', icon: Sun },
              { label: 'Dark', value: 'dark', icon: Moon },
              { label: 'HC', value: 'high-contrast', icon: Contrast },
            ]"
          />
        </fieldset>

        <fieldset class="flex flex-col gap-3">
          <legend class="mb-1 text-subtitle-2 text-primary">Brand colour</legend>
          <div class="flex items-center gap-2">
            <input v-model="state.brand" type="color" class="h-8 w-10 shrink-0 cursor-pointer rounded-control border border-line bg-surface p-0.5 focus-ring" aria-label="Pick brand colour" data-testid="pg-brand-picker" />
            <AkInput v-model="state.brand" size="sm" aria-label="Brand colour hex" :invalid="!validHex" class="min-w-0 flex-1 font-mono" />
          </div>
          <ul class="flex flex-wrap gap-2" aria-label="Brand presets">
            <li v-for="p in presets" :key="p.hex">
              <button
                type="button"
                class="size-7 rounded-full border-2 focus-ring"
                :class="state.brand.toLowerCase() === p.hex ? 'border-fg-primary' : 'border-transparent'"
                :style="{ background: p.hex }"
                :aria-label="`${p.name} (${p.hex})`"
                :aria-pressed="state.brand.toLowerCase() === p.hex ? 'true' : 'false'"
                @click="state.brand = p.hex"
              />
            </li>
          </ul>
          <div class="flex flex-wrap gap-2">
            <AkButton size="sm" :icon="Globe" :disabled="!validHex" data-testid="pg-apply-site" @click="applyToSite">Apply to whole site</AkButton>
            <AkButton size="sm" variant="subtle" @click="resetSite">Restore site</AkButton>
          </div>
        </fieldset>

        <fieldset class="flex flex-col gap-3">
          <legend class="mb-1 text-subtitle-2 text-primary">Corner radius</legend>
          <label class="flex flex-col gap-1 text-body-1 text-secondary">
            <span class="flex justify-between">Controls <span class="text-primary">{{ state.radiusControl }}px</span></span>
            <input v-model.number="state.radiusControl" type="range" min="0" max="16" step="1" class="accent-[var(--ak-color-brand-primary)]" data-testid="pg-radius" />
          </label>
          <label class="flex flex-col gap-1 text-body-1 text-secondary">
            <span class="flex justify-between">Cards and overlays <span class="text-primary">{{ state.radiusCard }}px</span></span>
            <input v-model.number="state.radiusCard" type="range" min="0" max="24" step="1" class="accent-[var(--ak-color-brand-primary)]" />
          </label>
        </fieldset>

        <fieldset class="flex flex-col gap-3">
          <legend class="mb-1 text-subtitle-2 text-primary">Button</legend>
          <AkField label="Variant" size="sm">
            <AkSelect v-model="state.button.variant" size="sm" :options="[...variants]" data-testid="pg-variant" />
          </AkField>
          <AkField label="Size" size="sm" hide-label>
            <AkSegmentedControl v-model="state.button.size" label="Button size" size="sm" block :options="[{ label: 'Small', value: 'sm' }, { label: 'Medium', value: 'md' }, { label: 'Large', value: 'lg' }]" />
          </AkField>
          <AkField label="Label" size="sm"><AkInput v-model="state.button.label" size="sm" /></AkField>
          <AkSwitch v-model="state.button.icon" label="Icon" />
          <AkSwitch v-model="state.button.disabled" label="Disabled" data-testid="pg-disabled" />
          <AkSwitch v-model="state.button.loading" label="Loading" data-testid="pg-loading" />
        </fieldset>

        <fieldset class="flex flex-col gap-3">
          <legend class="mb-1 text-subtitle-2 text-primary">Input</legend>
          <AkSegmentedControl v-model="state.input.size" label="Input size" size="sm" block :options="[{ label: 'Small', value: 'sm' }, { label: 'Medium', value: 'md' }, { label: 'Large', value: 'lg' }]" />
          <AkSegmentedControl
            v-model="state.input.validation"
            label="Validation state"
            size="sm"
            block
            data-testid="pg-validation"
            :options="[{ label: 'None', value: 'none' }, { label: 'Error', value: 'error' }, { label: 'Success', value: 'success' }]"
          />
          <AkField label="Label" size="sm"><AkInput v-model="state.input.label" size="sm" /></AkField>
          <AkSwitch v-model="state.input.disabled" label="Disabled" />
        </fieldset>

        <AkButton variant="subtle" :icon="RotateCcw" @click="reset">Reset playground</AkButton>
      </form>

      <div class="flex min-w-0 flex-col gap-6">
        <section class="overflow-hidden rounded-card border border-line-subtle bg-surface" aria-labelledby="pg-preview-h">
          <header class="flex flex-wrap items-center gap-3 border-b border-line-subtle px-4 py-2.5">
            <h2 id="pg-preview-h" class="min-w-0 flex-1 text-body-1-strong text-primary">Preview</h2>
            <AkSegmentedControl
              v-model="width"
              label="Preview width"
              size="sm"
              data-testid="pg-width"
              :options="[
                { label: '320', value: '320' },
                { label: '375', value: '375' },
                { label: '768', value: '768' },
                { label: '1024', value: '1024' },
                { label: 'Full', value: 'full' },
              ]"
            />
          </header>
          <div class="overflow-x-auto bg-background-secondary p-3" role="region" tabindex="0" aria-label="Preview viewport">
            <iframe
              ref="frame"
              src="/playground-frame"
              title="Playground preview"
              class="mx-auto block rounded-md border border-line-subtle bg-background transition-[width] duration-normal"
              :style="{ width: width === 'full' ? '100%' : `${width}px`, minWidth: width === 'full' ? '0' : `${width}px`, height: `${frameHeight}px` }"
              data-testid="pg-frame"
            />
          </div>
          <p class="border-t border-line-subtle px-4 py-2 text-caption-1 text-tertiary">
            The preview is a separate document, so breakpoints react to the width you choose and nothing here changes the rest of the site until you press “Apply to whole site”.
          </p>
        </section>

        <section aria-labelledby="pg-code-h">
          <h2 id="pg-code-h" class="mb-3 text-subtitle-1 text-primary">Generated code</h2>
          <AkTabs v-model="codeTab" label="Generated code" size="sm" :tabs="[{ id: 'vue', label: 'Component (Vue)' }, { id: 'css', label: 'Tokens (CSS)' }]">
            <template #vue><div class="pt-3"><CodeBlock :code="code.vue" lang="vue" title="Example.vue" /></div></template>
            <template #css><div class="pt-3"><CodeBlock :code="code.css" lang="css" title="theme.css" /></div></template>
          </AkTabs>
        </section>
      </div>
    </div>
  </div>
</template>
