<template>
  <div class="flex min-h-screen flex-col items-stretch">
    <HeaderComponent />

    <div class="grow p-6">
      <slot />
    </div>
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
