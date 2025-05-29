<template>
  <UCard
    :key="room.uuid"
    @click="$emit('navigate', `/escape-room/${room.url_slug}`)"
    class="cursor-pointer"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">
          {{ getTitle }}
        </h2>
        <UBadge
          v-if="showLocation && room.location?.city"
          color="neutral"
          variant="solid"
          :label="room.location.city"
        />
        <UChip v-else />
      </div>
    </template>

    <p class="text-gray-500 dark:text-gray-400 line-clamp-2">
      {{ getLead }}
    </p>

    <template #footer>
      <div class="flex gap-4">
        <UBadge
          :label="`${room.duration} min`"
          icon="i-lucide-clock"
          color="primary"
          variant="solid"
        />
        <UBadge
          :label="`${room.players_min}-${room.players_max} graczy`"
          icon="i-lucide-users"
          color="primary"
          variant="solid"
        />
        <UBadge
          :label="`od ${room.price_from} PLN`"
          icon="i-lucide-circle-dollar-sign"
          color="primary"
          variant="solid"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  room: {
    type: Object,
    required: true
  },
  showLocation: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['navigate']);

const getTranslation = (room) => {
  return room.translation || room.translations?.[0] || null;
};

const getTitle = computed(() => {
  const translation = getTranslation(props.room);
  return translation ? translation.title : '';
});

const getLead = computed(() => {
  const translation = getTranslation(props.room);
  return translation ? translation.lead : '';
});
</script>