<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 grid lg:grid-cols-2 lg:items-center">

    <div>
      <div class="grid grid-cols-1 md:grid-cols-6">
        <div>01</div>
        <div>02</div>
        <div>03</div>
        <div>04</div>
        <div>05</div>
        <div>06</div>
        <div>07</div>
        <div>08</div>
        <div>09</div>
      </div>
    </div>

    <div>
      <UButton>Hello</UButton>
    </div>


    <UCard>
      <template #header>
        AAA
      </template>

      BBB
      <template #footer>
        CCC
      </template>
    </UCard>

  </div>


</template>


<script setup lang="ts">

</script>


<style scoped>

</style>