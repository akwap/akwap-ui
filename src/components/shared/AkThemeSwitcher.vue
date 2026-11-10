<script setup lang="ts">
import { computed } from 'vue'
import { Sun, Moon, Monitor, Contrast } from '@lucide/vue'
import { useTheme, type ThemePreference } from '@/composables/useTheme'
import AkMenu from '../ui/overlays/AkMenu.vue'
import AkButton from '../ui/buttons/AkButton.vue'
import AkSegmentedControl from '../ui/buttons/AkSegmentedControl.vue'

/**
 * AkThemeSwitcher — Light / Dark / High contrast / System.
 * "segmented" shows a radio group; "menu" a compact icon button.
 */
withDefaults(defineProps<{ appearance?: 'menu' | 'segmented' }>(), { appearance: 'menu' })
const { preference, resolved, setTheme } = useTheme()
const options: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'high-contrast', label: 'High contrast', icon: Contrast },
  { value: 'system', label: 'System', icon: Monitor },
]
const currentIcon = computed(() => options.find((o) => o.value === resolved.value)?.icon ?? Sun)
const items = computed(() =>
  options.map((o) => ({ key: o.value, label: o.label, icon: o.icon, checked: preference.value === o.value, onSelect: () => setTheme(o.value) })),
)
</script>

<template>
  <AkMenu v-if="appearance === 'menu'" :items="items" placement="bottom-end" label="Theme">
    <template #trigger="{ attrs }">
      <AkButton v-bind="attrs" variant="subtle" icon-only :icon="currentIcon" aria-label="Change theme" data-testid="theme-switcher">Change theme</AkButton>
    </template>
  </AkMenu>
  <AkSegmentedControl
    v-else
    :model-value="preference"
    label="Theme"
    :options="options.map((o) => ({ value: o.value, label: o.label, icon: o.icon }))"
    data-testid="theme-segmented"
    @update:model-value="setTheme"
  />
</template>
