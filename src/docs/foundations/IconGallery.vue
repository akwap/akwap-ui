<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  House, LayoutDashboard, Users, UserRound, Settings, Bell, Search, Plus, Pencil, Trash2, Download, Upload, Filter, ArrowUpDown, ChevronDown, ChevronRight, X, Check, Info, TriangleAlert, CircleAlert, CircleCheck, Mail, Phone, Calendar, Clock, Lock, ShieldCheck, Eye, EyeOff, LogOut, Sun, Moon, Contrast, ChartLine, ChartColumn, FileText, Paperclip, Link, ExternalLink, Copy, Share2, Ellipsis, Menu, Globe, CreditCard, Wallet, Activity,
} from '@lucide/vue'
import { AkInput, AkSegmentedControl, useToast } from '@/design-system'

/** A curated set of the icons used across AkwapUI (Lucide, ISC licence). Import icons by name so bundles stay small. */
const all = { House, LayoutDashboard, Users, UserRound, Settings, Bell, Search, Plus, Pencil, Trash2, Download, Upload, Filter, ArrowUpDown, ChevronDown, ChevronRight, X, Check, Info, TriangleAlert, CircleAlert, CircleCheck, Mail, Phone, Calendar, Clock, Lock, ShieldCheck, Eye, EyeOff, LogOut, Sun, Moon, Contrast, ChartLine, ChartColumn, FileText, Paperclip, Link, ExternalLink, Copy, Share2, Ellipsis, Menu, Globe, CreditCard, Wallet, Activity }
const q = ref('')
const size = ref<16 | 20 | 24>(20)
const toast = useToast()
const list = computed(() =>
  Object.entries(all)
    .filter(([n]) => n.toLowerCase().includes(q.value.trim().toLowerCase()))
    .map(([name, icon]) => ({ name, icon })),
)
async function copy(name: string) {
  try {
    await navigator.clipboard.writeText(`import { ${name} } from '@lucide/vue'`)
    toast.success('Import copied', name)
  } catch {
    toast.info('Copy not available', `import { ${name} } from '@lucide/vue'`)
  }
}
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <AkInput v-model="q" type="search" clearable placeholder="Filter icons" aria-label="Filter icons" class="w-full sm:w-64" />
      <AkSegmentedControl v-model="size" size="sm" label="Icon size" :options="[{ label: '16', value: 16 }, { label: '20', value: 20 }, { label: '24', value: 24 }]" />
    </div>
    <ul class="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      <li v-for="i in list" :key="i.name">
        <button type="button" class="flex w-full flex-col items-center gap-2 rounded-md border border-line-subtle bg-surface px-1 py-3 text-secondary hover:bg-surface-hover hover:text-primary focus-ring" :aria-label="`Copy import for ${i.name}`" @click="copy(i.name)">
          <component :is="i.icon" :size="size" aria-hidden="true" />
          <span class="w-full truncate text-center text-caption-2">{{ i.name }}</span>
        </button>
      </li>
    </ul>
    <p v-if="!list.length" class="text-body-1 text-secondary">No icons match “{{ q }}”.</p>
  </div>
</template>
