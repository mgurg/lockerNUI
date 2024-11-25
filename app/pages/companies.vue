<template>

  <UContainer>
    <UAccordion :items="items"/>
  </UContainer>


</template>


<script setup lang="ts">
import { DefaultService } from "@/client";

// https://github.com/Semolik/music/blob/3aa04a1ed3efae9e57d9c71942f959655c1d085a/frontend/stores/auth.js#L51
async function refresh() {
  try {
    await DefaultService.readRootGet();
  } catch (error) {
    console.log(error);
  }
}

refresh();

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
