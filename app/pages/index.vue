<template>
  <UContainer>
    <UCard>
      <template #header>
        <h1 class="text-4xl font-extrabold">Analiza rynku Escape Room w Polsce</h1>
      </template>
      Nic tu jeszcze nie ma 🫣 ale na <ULink as="button" :href="runtimeConfig.public.blogUrl">blogu</ULink> są już pierwsze artukuły 🙂
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
</script>

<style scoped>
</style>