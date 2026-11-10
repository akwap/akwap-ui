<script setup lang="ts">
import { computed, ref } from 'vue'
import { AkCheckbox } from '@/design-system'

const all = ['email', 'sms', 'push'] as const
const channels = ref<string[]>(['email'])
const allChecked = computed({
  get: () => channels.value.length === all.length,
  set: (v: boolean) => (channels.value = v ? [...all] : []),
})
const some = computed(() => channels.value.length > 0 && channels.value.length < all.length)
</script>

<template>
  <fieldset class="flex flex-col gap-2">
    <legend class="mb-2 text-body-1-strong text-primary">Notification channels</legend>
    <AkCheckbox v-model="allChecked" :indeterminate="some" label="All channels" />
    <div class="ml-7 flex flex-col gap-2">
      <AkCheckbox v-model="channels" value="email" label="Email" description="Daily digest and security alerts" />
      <AkCheckbox v-model="channels" value="sms" label="SMS" />
      <AkCheckbox v-model="channels" value="push" label="Push notifications" />
    </div>
  </fieldset>
</template>
