<template>
  <div v-if="room">
    <div class="relative bg-black text-white rounded-xl">
      <!-- Hero Section (Limited to 1/3 height) -->
      <div class="relative w-full h-[33vh] overflow-hidden rounded-xl ">
        <!-- Fading Effect Over Image -->
        <div
            class="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 via-transparent to-black/60 z-10 rounded-xl">
        </div>

        <!-- Background Gradient (Only if Image Fails) -->
        <div id="fallback-bg" class="absolute inset-0 bg-gradient-to-b from-gray-900 to-black hidden rounded-xl"></div>

        <img
            src="https://picsum.photos/1200/800"
            :alt="room.translation.title"
            class="object-cover w-full h-full rounded-xl"
            onerror="document.getElementById('fallback-bg').classList.remove('hidden'); this.style.display='none';"
        />

        <!-- Content Overlay (Inside Image) -->
        <div class="absolute inset-0 flex flex-col justify-end p-5 sm:p-10 z-20">
          <h1 class="text-3xl sm:text-4xl font-bold [text-shadow:_0_1px_2px_rgba(0,0,0,0.7)]">{{ room.translation.title }}</h1>
          <p class="text-lg text-gray-300 mt-2 font-semibold [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)]">{{ room.location.city }}</p>

          <p class="mt-4 text-gray-200 font-normal  [text-shadow:_0_5px_5px_rgba(0,0,0,0.5)] hidden sm:block">
            {{ room.translation.lead }}
          </p>

          <!-- Actions -->
          <div class="mt-6 flex space-x-4">
            <UButton color="primary" variant="solid" :href="room.reservation_url">Book Now</UButton>
            <UButton color="primary" variant="outline">Share</UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-full py-8 mx-auto">
      <div class="max-w-2xl w-full mx-auto">
        <!-- Room Description -->
        <UCard class="mb-8">
          <template #header>
            <h2 class="text-xl font-semibold">About This Room</h2>
          </template>
          <p class="description-text">{{ room.translation.description }}</p>
        </UCard>

        <!-- Key Information -->
        <UCard class="mb-8">
          <template #header>
            <h2 class="text-xl font-semibold">Room Details</h2>
          </template>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <UIcon name="i-lucide-gauge" class="mb-2"/>
              <h3 class="font-medium">Difficulty</h3>
              <p class="text-gray-500 dark:text-gray-400">Advanced</p>
            </div>
            <div>
              <UIcon name="i-lucide-users" class="mb-2"/>
              <h3 class="font-medium">Gracze</h3>
              <p class="text-gray-500 dark:text-gray-400">{{ room.players_min }}-{{ room.players_max }} os.</p>
            </div>
            <div>
              <UIcon name="i-lucide-circle-dollar-sign" class="mb-2"/>
              <h3 class="font-medium">Cena od</h3>
              <p class="text-gray-500 dark:text-gray-400">From {{ room.price_from }} PLN</p>
            </div>
            <div>
              <UIcon name="i-lucide-clock-4" class="mb-2"/>
              <h3 class="font-medium">Duration</h3>
              <p class="text-gray-500 dark:text-gray-400">{{ room.duration }} min.</p>
            </div>
            <div>
              <UIcon name="i-lucide-drama" class="mb-2"/>
              <h3 class="font-medium">Success Rate</h3>
              <p class="text-gray-500 dark:text-gray-400">35%</p>
            </div>
            <div>
              <UIcon name="i-lucide-languages" class="mb-2"/>
              <h3 class="font-medium">Languages</h3>
              <p class="text-gray-500 dark:text-gray-400">EN, ES</p>
            </div>
          </div>
        </UCard>

        <!-- Pros & Cons Section -->
        <UCard class="mb-8">
          <template #header>
            <h2 class="text-xl font-semibold">Room Overview</h2>
          </template>

          <div class="space-y-4">
            <!-- Pros Accordion -->
            <UAccordion :items="pros">
              <template #content="{ item }">
                <p class="pb-3.5 text-sm text-(--ui-text-muted)" v-for="(text, index) in item.content" :key="index">
                  {{ text }}
                </p>
              </template>
            </UAccordion>

            <!-- Cons Accordion -->
            <UAccordion :items="cons">
              <template #content="{ item }">
                <p class="pb-3.5 text-sm text-(--ui-text-muted)" v-for="(text, index) in item.content" :key="index">
                  {{ text }}
                </p>
              </template>
            </UAccordion>
          </div>
        </UCard>

        <!-- Location Information -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Location & Contact</h2>
          </template>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-map-pin" class="flex-shrink-0 mt-1"/>
              <div>
                <h3 class="font-medium">Address</h3>
                <p class="text-gray-500 dark:text-gray-400">
                  {{ room.location.street_address }}<br/>
                  {{ room.location.postal_code }} {{ room.location.city }}<br/>
                  {{ room.location.located_in }}
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-phone" class="flex-shrink-0 mt-1"/>
              <div>
                <h3 class="font-medium">Phone</h3>
                <p class="text-gray-500 dark:text-gray-400">+1 (555) 123-4567</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-at-sign" class="flex-shrink-0 mt-1"/>
              <div>
                <h3 class="font-medium">Email</h3>
                <p class="text-gray-500 dark:text-gray-400">info@duneescape.com</p>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Other Rooms Section -->
<!--        <UCard class="mt-8">-->
<!--          <template #header>-->
<!--            <div class="flex justify-between items-center">-->
<!--              <h2 class="text-xl font-semibold">Also in this Location</h2>-->
<!--              <UButton-->
<!--                  color="gray"-->
<!--                  variant="ghost"-->
<!--                  icon="i-heroicons-arrow-right"-->
<!--                  label="View all"-->
<!--              />-->
<!--            </div>-->
<!--          </template>-->

<!--          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">-->
<!--            &lt;!&ndash; Room Card 1 &ndash;&gt;-->
<!--            <UCard>-->
<!--              <template #header>-->
<!--                <div class="relative h-48">-->
<!--                  <img-->
<!--                      src="https://picsum.photos/400/300"-->
<!--                      alt="Cyberpunk Room"-->
<!--                      class="absolute inset-0 w-full h-full object-cover rounded-t-lg"-->
<!--                  />-->
<!--                  <div class="absolute top-2 right-2">-->
<!--                    <UBadge color="blue" variant="solid">New</UBadge>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </template>-->
<!--              <div class="space-y-2">-->
<!--                <h3 class="font-medium text-lg">Neon Nights 2099</h3>-->
<!--                <div class="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">-->
<!--          <span class="flex items-center gap-1">-->
<!--            <UIcon name="i-heroicons-signal"/>-->
<!--            Medium-->
<!--          </span>-->
<!--                  <span class="flex items-center gap-1">-->
<!--            <UIcon name="i-heroicons-clock"/>-->
<!--            60 min-->
<!--          </span>-->
<!--                  <span class="flex items-center gap-1">-->
<!--            <UIcon name="i-heroicons-user-group"/>-->
<!--            2-5-->
<!--          </span>-->
<!--                </div>-->
<!--                <p class="text-sm text-gray-700 dark:text-gray-300">-->
<!--                  Hack your way through a dystopian cyberpunk world-->
<!--                </p>-->
<!--              </div>-->
<!--              <template #footer>-->
<!--                <div class="flex justify-between items-center">-->
<!--                  <span class="font-medium">From $25/person</span>-->
<!--                  <UButton color="primary" variant="solid" size="sm">Book Now</UButton>-->
<!--                </div>-->
<!--              </template>-->
<!--            </UCard>-->

<!--            &lt;!&ndash; Room Card 2 &ndash;&gt;-->
<!--            <UCard>-->
<!--              <template #header>-->
<!--                <div class="relative h-48">-->
<!--                  <img-->
<!--                      src="https://picsum.photos/400/301"-->
<!--                      alt="Medieval Room"-->
<!--                      class="absolute inset-0 w-full h-full object-cover rounded-t-lg"-->
<!--                  />-->
<!--                  <div class="absolute top-2 right-2">-->
<!--                    <UBadge color="orange" variant="solid">Popular</UBadge>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </template>-->
<!--              <div class="space-y-2">-->
<!--                <h3 class="font-medium text-lg">Dragon's Keep</h3>-->
<!--                <div class="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">-->
<!--          <span class="flex items-center gap-1">-->
<!--            <UIcon name="i-heroicons-signal"/>-->
<!--            Hard-->
<!--          </span>-->
<!--                  <span class="flex items-center gap-1">-->
<!--            <UIcon name="i-heroicons-clock"/>-->
<!--            75 min-->
<!--          </span>-->
<!--                  <span class="flex items-center gap-1">-->
<!--            <UIcon name="i-heroicons-user-group"/>-->
<!--            3-8-->
<!--          </span>-->
<!--                </div>-->
<!--                <p class="text-sm text-gray-700 dark:text-gray-300">-->
<!--                  Medieval fantasy adventure with magical puzzles-->
<!--                </p>-->
<!--              </div>-->
<!--              <template #footer>-->
<!--                <div class="flex justify-between items-center">-->
<!--                  <span class="font-medium">From $30/person</span>-->
<!--                  <UButton color="primary" variant="solid" size="sm">Book Now</UButton>-->
<!--                </div>-->
<!--              </template>-->
<!--            </UCard>-->
<!--          </div>-->
<!--        </UCard>-->

      </div>
    </div>
  </div>
</template>


<script setup>
import {ref} from 'vue';

import {roomByUrlSlugRoomsUrlLanguageRoomUrlSlugGet} from "~/client/index.ts";
import {useRoute} from "vue-router";

const localePath = useLocalePath()
const route = useRoute();
const roomSlug = route.params.slug || route.path.split("/").pop();


const room = ref()

const fetchRoom = async () => {
  try {
    const response = await roomByUrlSlugRoomsUrlLanguageRoomUrlSlugGet({
      path: {language: "pl", room_url_slug: roomSlug},
    });
    room.value = response.data;
  } catch (error) {
    console.error("Failed to fetch escape room details:", error);
  }
};

fetchRoom();

const redirectToExternalPage = async (path ,uuid) => {
  const query = uuid ? { uuid } : {};

  await navigateTo({
    path: localePath(path),
    query
  });
};

const pros = ref([
  {
    label: 'What We Love',
    icon: 'i-lucideicons-thumbs-up',
    content: [
      "✅ Immersive atmosphere with stunning visual effects and authentic Dune-inspired props",
      "✅ Unique puzzles that blend sci-fi elements with logical thinking",
      "✅ Perfect for fans of the Dune universe with many thematic references"
    ]
  }
]);

const cons = ref([
  {
    label: 'Keep in Mind',
    icon: 'i-lucideicons-thumbs-down',
    content: [
      "⚠️ Challenging difficulty level - not recommended for beginners",
      "⚠️ Some puzzles require physical activity and crawling",
      "⚠️ Room can get warm due to special effects - dress accordingly"
    ]
  }
]);
</script>

<style scoped>
.description-text {
  white-space: pre-line;
}
</style>