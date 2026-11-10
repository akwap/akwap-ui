<script setup lang="ts">
import { AkAvatarGroup } from '@/design-system'
import { users } from '@/services/mockData'

const people = users.slice(0, 9).map((u) => ({ name: u.name }))
</script>

<template>
  <div class="flex flex-col gap-4">
    <AkAvatarGroup :people="people" label="Project members" />
    <AkAvatarGroup :people="people" :max="6" :size="24" label="Reviewers" />
  </div>
</template>
