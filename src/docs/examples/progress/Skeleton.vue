<script setup lang="ts">
import { ref } from 'vue'
import { AkAvatar, AkButton, AkSkeleton } from '@/design-system'

const loading = ref(true)
</script>

<template>
  <AkButton size="sm" class="mb-4" @click="loading = !loading">{{ loading ? 'Finish loading' : 'Reload' }}</AkButton>
  <div class="flex max-w-sm gap-3 rounded-card border border-line-subtle bg-surface p-4" :aria-busy="loading ? 'true' : 'false'">
    <template v-if="loading">
      <AkSkeleton shape="circle" width="40px" height="40px" />
      <div class="flex-1"><AkSkeleton :lines="3" /></div>
    </template>
    <template v-else>
      <AkAvatar name="Amina Okafor" :size="40" decorative />
      <div>
        <p class="text-body-1-strong text-primary">Amina Okafor</p>
        <p class="text-body-1 text-secondary">Admin · Nairobi, Kenya. Joined March 2023.</p>
      </div>
    </template>
  </div>
</template>
