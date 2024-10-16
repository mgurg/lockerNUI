<template>

  <UContainer>
    <UAccordion :items="items"/>
  </UContainer>


</template>


<script setup lang="ts">
const items = ref([
  {
    label: 'ER Corp',
    icon: 'heroicons:building-office',
    content: 'ER Corp'
  },
  {
    label: 'ER ACME',
    icon: 'heroicons:building-office',
    content: 'ER ACME'
  },
  {
    label: 'Ermex-pol',
    icon: 'heroicons:building-office',
    content: 'Ermex-pol'
  }
])
</script>

<style scoped>

</style>