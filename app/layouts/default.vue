<template>
  <div>
    <HeaderComponent/>
    <main >
      <NuxtPage/>
    </main>
<!--    <FooterComponent/>-->
  </div>
</template>

<script setup>

</script>

<style>
main {
  min-height: calc(100vh - 100px); /* Adjust as needed */
  padding: 20px;
}
</style>
