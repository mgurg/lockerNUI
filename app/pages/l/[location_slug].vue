<template>
  <div>
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
      Kraków
    </h1>
    <div v-if="rooms && rooms.length > 0">
      <div v-for="room in rooms" :key="room.uuid"
           class="p-4 text-md cursor-pointer border-2 border-slate-700 text-gray-600 dark:text-gray-300"
           @click="redirectToRoomDetailsPage(room.url_slug)">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 font-semibold py-2 text-lg">
            {{ room.translation.title }}
            <UChip/>
          </div>
        </div>
        <p class="text-gray-400 dark:text-gray-500 line-clamp-2">
          {{ room.translation.lead }}
        </p>
        <div class="text-gray-400 dark:text-gray-500 line-clamp-1 space-x-4 pt-2">
          <UBadge
              icon="i-lucide-clock"
              size="lg"
              color="primary"
              variant="solid"
              :label="`${room.game_duration} min`"
              :trailing="false"
          />
          <UBadge
              icon="i-lucide-users"
              size="lg"
              color="primary"
              variant="solid"
              :label="`${room.players_min}-${room.players_max}`"
              :trailing="false"
          />
          <UBadge
              icon="i-lucide-circle-dollar-sign"
              size="lg"
              color="primary"
              variant="solid"
              :label="`od ${room.price_from} PLN`"
              :trailing="false"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-500 dark:text-gray-400">Loading escape rooms...</p>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {roomsByLocationRoomsUrlLanguagePlaceLocationGet} from "~/client/index";

const localePath = useLocalePath()

const rooms = ref();

const fetchRooms = async () => {
  try {
    const response = await roomsByLocationRoomsUrlLanguagePlaceLocationGet({
      path: {language: "pl", location: "krakow"},
    });
    rooms.value = response.data.data;
  } catch (error) {
    console.error("Failed to fetch escape rooms:", error);
  }
};

fetchRooms();

const redirectToRoomDetailsPage = async (url) => {
  await navigateTo({
    path: localePath(`/${url}`)
  });
};
</script>

<style scoped>
</style>
