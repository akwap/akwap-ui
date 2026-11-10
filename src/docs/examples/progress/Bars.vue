<script setup lang="ts">
import { AkProgressBar } from '@/design-system'
</script>

<template>
  <div class="flex max-w-md flex-col gap-5">
    <AkProgressBar :value="42" label="Uploading files" show-value helper="3 of 7 files" />
    <AkProgressBar :value="92" intent="warning" label="Storage" value-text="46 of 50 GB" show-value />
    <AkProgressBar :value="100" intent="success" label="Profile complete" show-value thickness="thin" />
    <AkProgressBar :value="18" intent="danger" label="Quota remaining" show-value thickness="large" />
    <AkProgressBar label="Preparing export (indeterminate)" />
  </div>
</template>
