<script setup lang="ts">
import { computed, ref } from 'vue'
import { AkPagination } from '@/design-system'
import { users } from '@/services/mockData'

const page = ref(1)
const pageSize = ref(10)
const visible = computed(() => users.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))
</script>

<template>
  <ul class="mb-4 grid gap-1 text-body-1 text-secondary sm:grid-cols-2">
    <li v-for="u in visible" :key="u.id" class="truncate">{{ u.name }}</li>
  </ul>
  <AkPagination v-model:page="page" v-model:page-size="pageSize" :total="users.length" label="Members pagination" />
</template>
