<script setup lang="ts">
import { AkIcon, ACCENT_COLORS } from '@/design-system'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <AkIcon name="success" color="success" label="Success" />
      <AkIcon name="warning" color="warning" label="Warning" />
      <AkIcon name="error" color="danger" label="Error" />
      <AkIcon name="info" color="info" label="Information" />
      <AkIcon name="favorite" color="brand" label="Favourite" />
      <AkIcon name="help" color="secondary" label="Help" />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <AkIcon v-for="c in ACCENT_COLORS" :key="c" name="tag" :color="c" size="lg" :label="`${c} tag`" />
    </div>
  </div>
</template>
