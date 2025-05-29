<template>
  <div>
    <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl mb-4">
      Escape room w {{ cityDetails.city_name_inflect }}
    </h1>

    <p class="text-gray-500 dark:text-gray-400">
      Szukasz <span class="font-bold">escape room w mieście {{ cityDetails.city_name }}?</span>
      <span v-if="cityDetails.importance >= 0.60">
        To jedno z najważniejszych miast w Polsce, oferujące bogatą historię i niezapomniane atrakcje.
      </span>
      <span v-else-if="cityDetails.importance >= 0.50">
        To piękne miasto z interesującą historią i miejscami wartymi odwiedzenia.
      </span>
      <span v-else>
        To urokliwe miasteczko, które kryje w sobie wiele ciekawych zakątków do odkrycia.
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  cityDetails: {
    type: Object,
    required: true
  }
});
</script>