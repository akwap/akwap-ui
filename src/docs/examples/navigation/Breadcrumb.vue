<script setup lang="ts">
import { AkBreadcrumb } from '@/design-system'
</script>

<template>
  <div class="flex flex-col gap-4">
    <AkBreadcrumb :items="[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Users', to: '/dashboard/users' }, { label: 'Amina Okafor' }]" />
    <AkBreadcrumb
      size="sm"
      :max-visible="3"
      :items="[
        { label: 'Docs', to: '/docs' },
        { label: 'Components', to: '/docs/components/button' },
        { label: 'Navigation', to: '/docs/components/navigation' },
        { label: 'Breadcrumb' },
      ]"
    />
  </div>
</template>
