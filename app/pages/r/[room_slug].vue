<template>
  <div>
    <div v-if="room" class="space-y-6">
      <UCard>
        <template #header>
          <div class="flex items-center gap-3 font-semibold py-2 text-2xl">
            {{ room.translation.title }}
          </div>
          <div class="space-x-4 pt-2">
            <UButton @click="redirectToReservation">Zarezerwuj</UButton>
            <UButton @click="call">Zadzwoń</UButton>
          </div>
        </template>
        <div>
          {{ room.translation.description }}
        </div>
        <template #footer>
          <div class="text-gray-400 dark:text-gray-500 line-clamp-1 space-x-4 pt-2">
            <UBadge
                icon="i-lucide-clock"
                size="lg"
                color="primary"
                variant="solid"
                :label="room.game_duration + '\u0027'"
                :trailing="false"
            />
            <UBadge
                icon="i-lucide-users"
                size="lg"
                color="primary"
                variant="solid"
                :label="room.players_min + '-' + room.players_max"
                :trailing="false"
            />
          </div>
        </template>
      </UCard>

      <div>
        <UAccordion :items="items"/>
      </div>
    </div>
    <div v-else>
      <p>Loading room details...</p>
    </div>
  </div>
</template>

<script setup>
import {roomByUrlSlugRoomsUrlLanguageRoomUrlSlugGet} from "~/client/index.ts";
import {useRoute} from "vue-router";

const route = useRoute();
const roomSlug = route.params.slug || route.path.split("/").pop();


const room = ref()

const fetchRoom = async () => {
  try {
    const response = await roomByUrlSlugRoomsUrlLanguageRoomUrlSlugGet({
      path: { language: "pl", room_url_slug: roomSlug },
    });
    room.value = response.data;
  } catch (error) {
    console.error("Failed to fetch escape room details:", error);
  }
};

fetchRoom();


const redirectToReservation = () => {
  if (room.value?.reservation_url) {
    window.open(room.value.reservation_url, "_blank");
  }
};

const call = () => {
  alert("Calling the escape room contact number...");
};


const items = ref([
  {
    label: 'Pros',
    icon: 'i-lucide-thumbs-up',
    content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
  },
  {
    label: 'Cons',
    icon: 'i-lucide-thumbs-down',
    content: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
  }
])

</script>


<style scoped>

</style>