<script setup lang="ts">
import { ref } from 'vue'
import { AkPagination } from '@/design-system'

const page = ref(12)
</script>

<template>
  <AkPagination v-model:page="page" :page-size="20" :total="1240" :siblings="0" :page-sizes="[]" :show-summary="false" label="Log pages" />
</template>
