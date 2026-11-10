<script setup lang="ts">
import { CheckCircle2, Mail, MapPin, Rocket, UserPlus } from '@lucide/vue'
import { AkActivityFeed, AkDescriptionList, AkKeyValue, AkTimeline } from '@/design-system'
import { recentActivity } from '@/services/mockData'
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <section>
      <h4 class="mb-3 text-subtitle-2 text-primary">Description list</h4>
      <AkDescriptionList
        :items="[
          { term: 'Plan', description: 'Business' },
          { term: 'Seats', description: '57 of 60' },
          { term: 'Renews', description: 'Dec 1, 2026' },
          { term: 'Billing contact', description: null },
        ]"
        dividers
      />
      <div class="mt-4 flex flex-col gap-2">
        <AkKeyValue label="Email" value="amina@akwap.example" :icon="Mail" />
        <AkKeyValue label="Location" value="Nairobi, Kenya" :icon="MapPin" />
      </div>
    </section>
    <section>
      <h4 class="mb-3 text-subtitle-2 text-primary">Timeline</h4>
      <AkTimeline
        :items="[
          { id: 1, title: 'Workspace created', time: 'Mar 2023', icon: Rocket, intent: 'brand' },
          { id: 2, title: 'First teammate invited', description: 'Kwame joined as Manager', time: 'Mar 2023', icon: UserPlus },
          { id: 3, title: 'Verified domain', time: 'Apr 2023', icon: CheckCircle2, intent: 'success' },
        ]"
      />
    </section>
    <section class="lg:col-span-2">
      <h4 class="mb-3 text-subtitle-2 text-primary">Activity feed</h4>
      <AkActivityFeed :items="recentActivity.slice(0, 3)" compact />
    </section>
  </div>
</template>
