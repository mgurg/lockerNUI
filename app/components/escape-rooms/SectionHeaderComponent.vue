<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">{{ title }}</h2>
    <p class="text-gray-500 dark:text-gray-400">
      <slot></slot>
    </p>
    <slot name="content"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>