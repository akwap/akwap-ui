<script setup lang="ts">
import AkButton from '@/components/ui/buttons/AkButton.vue'
import AkwapMark from '@site/components/AkwapMark.vue'
</script>

<template>
  <section class="grid min-h-[80svh] place-items-center px-4 pt-18 text-center" aria-labelledby="nf-title">
    <div>
      <AkwapMark :size="96" animated class="mx-auto" />
      <p class="site-eyebrow mt-8">Error 404</p>
      <h1 id="nf-title" class="mt-3 text-[length:clamp(32px,4vw,56px)] font-bold tracking-tight">This page drifted out of orbit</h1>
      <p class="mt-4 text-body-2 text-secondary">The page you are looking for does not exist or has moved.</p>
      <AkButton to="/" variant="primary" size="lg" class="mt-8">Back to home</AkButton>
    </div>
  </section>
</template>
