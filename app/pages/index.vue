<template>
  <UContainer>
    <UCard>
      <template #header>
        <h1 class="text-4xl font-extrabold">Analiza rynku Escape Room w Polsce</h1>
      </template>
      Nic tu jeszcze nie ma 🫣 ale na <ULink  :href="blogUrl">blogu</ULink> są już pierwsze artukuły 🙂
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const { public: { BLOG_URL } } = useRuntimeConfig();
const blogUrl = BLOG_URL;
</script>

<style scoped>
</style>
