<template>
  <SectionHeaderComponent :title="title">
    {{ description }}
    <template #content>
      <UButton
        :to="mapLink"
        icon="i-lucide-map"
        size="lg"
        target="_blank"
      >
        {{ buttonText }}
      </UButton>
    </template>
  </SectionHeaderComponent>
</template>

<script setup lang="ts">
import SectionHeaderComponent from './SectionHeaderComponent.vue';

defineProps({
  title: {
    type: String,
    default: 'Znajdź escape room na mapie'
  },
  description: {
    type: String,
    required: true
  },
  mapLink: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    default: 'Otwórz mapę escape room'
  }
});
</script>