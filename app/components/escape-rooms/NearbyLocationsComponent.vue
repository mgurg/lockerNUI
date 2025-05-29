<template>
  <SectionHeaderComponent :title="title">
    {{ description }}
    <template #content>
      <div class="my-4 py-4 flex flex-wrap gap-2">
        <UButton
          v-for="(city, index) in cities"
          :key="index"
          @click="$emit('navigate', `/escape-rooms/${city.name}`)"
        >
          Escape room w {{ city.name }}
        </UButton>
      </div>
    </template>
  </SectionHeaderComponent>
</template>

<script setup lang="ts">
import SectionHeaderComponent from './SectionHeaderComponent.vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Pobliskie miejscowości'
  },
  description: {
    type: String,
    default: 'Podrzucam jeszcze listę najbliższych miejscowości która mam w bazie na wypadek gdybym przegapił jakiś ER'
  },
  cities: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['navigate']);
</script>