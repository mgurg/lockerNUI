<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </UApp>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";
</style>

<script setup lang="ts">
useHead({
  meta: [
    {
      name: 'msvalidate.01',
      content: '9C7D5BBDE799324043D7F0AF819431EE'
    }
  ]
})
</script>
