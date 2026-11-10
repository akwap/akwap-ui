<script setup lang="ts">
import { AkAvatar } from '@/design-system'
const sizes = [20, 24, 32, 40, 48, 64, 96] as const
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-end gap-3">
      <AkAvatar v-for="s in sizes" :key="s" name="Amina Okafor" :size="s" />
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <AkAvatar name="Kwame Mensah" presence="available" :size="40" />
      <AkAvatar name="Zawadi Njeri" presence="away" :size="40" />
      <AkAvatar name="Tunde Bello" presence="busy" :size="40" />
      <AkAvatar name="Lindiwe Dube" presence="offline" :size="40" />
      <AkAvatar name="Akwap Cloud" shape="square" :size="40" />
    </div>
  </div>
</template>
