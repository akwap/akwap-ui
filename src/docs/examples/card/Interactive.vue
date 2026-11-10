<script setup lang="ts">
import { ref } from 'vue'
import { MoreHorizontal, Users } from '@lucide/vue'
import { AkButton, AkCard, AkMenu, AkBadge, useToast } from '@/design-system'

const toast = useToast()
const plan = ref('team')
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2">
    <AkCard title="Design team" subtitle="12 members · Updated 2 hours ago">
      <template #actions>
        <AkMenu :items="[{ label: 'Rename', onSelect: () => toast.info('Rename team') }, { label: 'Archive', danger: true, onSelect: () => toast.warning('Team archived') }]">
          <template #trigger="{ attrs }">
            <AkButton variant="subtle" size="sm" icon-only :icon="MoreHorizontal" aria-label="Team actions" v-bind="attrs" />
          </template>
        </AkMenu>
      </template>
      <p class="text-body-1 text-secondary">Owns the design system, brand and marketing site.</p>
      <template #footer>
        <AkButton size="sm" :icon="Users" to="/dashboard/users">View members</AkButton>
      </template>
    </AkCard>

    <div class="grid gap-3" role="radiogroup" aria-label="Plan">
      <AkCard
        v-for="p in ['starter', 'team']"
        :key="p"
        padding="sm"
        :selected="plan === p"
        role="radio"
        :aria-checked="plan === p ? 'true' : 'false'"
        tabindex="0"
        class="cursor-pointer focus-ring"
        @click="plan = p"
        @keydown.space.prevent="plan = p"
        @keydown.enter.prevent="plan = p"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="text-body-1-strong text-primary capitalize">{{ p }}</span>
          <AkBadge v-if="plan === p" color="brand" size="sm">Selected</AkBadge>
        </div>
      </AkCard>
    </div>
  </div>
</template>
