<template>
  <SectionHeaderComponent :title="title">
    {{ description }}
    <template #content>
      <UButton
        :to="buttonLink"
        icon="i-lucide-gamepad-2"
        size="lg"
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
    default: 'Wirtualny escape room'
  },
  description: {
    type: String,
    default: 'Wypróbuj wirtualny escape room generowany przez ChatGPT. Każda gra jest unikatowa i tworzona specjalnie dla Ciebie.'
  },
  buttonLink: {
    type: String,
    default: '/er_game'
  },
  buttonText: {
    type: String,
    default: 'Escape room on-line - graj!'
  }
});
</script>