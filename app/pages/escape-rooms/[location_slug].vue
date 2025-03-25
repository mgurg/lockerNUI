<template>
  <UContainer>
    <div v-if="isLoading">
      <USkeleton class="h-32 w-full"/>
    </div>

    <div v-else-if="error">
      <UAlert
          title="Error loading data"
          description="Unable to load escape room data. Please try again later."
          color="warning"
      />
    </div>

    <template v-else>
      <!-- Rooms listing section -->
      <section v-if="rooms?.length">
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl mb-8">
          Escape room-y w {{ cityDetails?.city_name }}
        </h1>

        <TransitionGroup name="list" tag="div" class="space-y-4">
          <UCard
              v-for="room in rooms"
              :key="room.uuid"
              @click="redirectToExternalPage(`/escape-room/${room.url_slug}`)"
              class="cursor-pointer"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold">
                  {{ room.translation.title }}
                </h2>
                <UChip/>
              </div>
            </template>

            <p class="text-gray-500 dark:text-gray-400 line-clamp-2">
              {{ room.translation.lead }}
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
        </TransitionGroup>
      </section>

      <!-- No rooms in city section -->
      <section v-else-if="cityDetails" class="space-y-8">
        <div>
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl mb-4">
            Escape room w {{ cityDetails.city_name_inflect }}
          </h1>

          <p class="text-gray-500 dark:text-gray-400">
            Szukasz <span class="font-bold">escape room w mieście {{ cityDetails.city_name }}?</span>
            <span v-if="cityDetails.importance >= 0.60">
              To jedno z najważniejszych miast w Polsce, oferujące bogatą historię i niezapomniane atrakcje.
            </span>
            <span v-else-if="cityDetails.importance >= 0.50">
              To piękne miasto z interesującą historią i miejscami wartymi odwiedzenia.
            </span>
            <span v-else>
              To urokliwe miasteczko, które kryje w sobie wiele ciekawych zakątków do odkrycia.
            </span>
          </p>
        </div>

        <UAlert
            title="Brak pokoi w bazie"
            :description="`Na tą chwilę mamy w bazie ${roomsCounter} pokoi zagadek w innych miastach. Sprawdź dostępne pokoje w okolicy!`"
            color="warning"
        />

        <!-- Virtual escape room section -->
        <div class="space-y-4">
          <h2 class="text-2xl font-bold">Wirtualny escape room</h2>
          <p class="text-gray-500 dark:text-gray-400">
            Wypróbuj wirtualny escape room generowany przez ChatGPT.
            Każda gra jest unikatowa i tworzona specjalnie dla Ciebie.
          </p>
          <UButton
              to="/er_game"
              icon="i-lucide-gamepad-2"
              size="lg"
          >
            Rozpocznij grę
          </UButton>
        </div>

        <!-- Nearby rooms section -->
        <div v-if="nearbyRooms?.length" class="space-y-4">
          <h2 class="text-2xl font-bold">Najbliższe escape room-y</h2>
          <p class="text-gray-500 dark:text-gray-400 mb-4">
            Sprawdź dostępne pokoje w pobliskich miastach:
          </p>

          <TransitionGroup name="list" tag="div" class="space-y-4">
            <UCard
                v-for="room in nearbyRooms"
                :key="room.uuid"
                @click="redirectToExternalPage(`/escape-room/${room.url_slug}`)"
            >
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-xl font-semibold">
                    {{ getTranslation(room).title }}
                  </h3>
                  <UBadge
                      v-if="room.location?.city"
                      color="gray"
                      variant="solid"
                      :label="room.location.city"
                  />
                </div>
              </template>

              <p class="text-gray-500 dark:text-gray-400 line-clamp-2">
                {{ getTranslation(room).lead }}
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
          </TransitionGroup>
        </div>


        <!-- Google Maps section -->
        <div class="space-y-4">
          <h2 class="text-2xl font-bold">Znajdź escape room na mapie</h2>
          <p class="text-gray-500 dark:text-gray-400">
            Sprawdź dostępne escape room-y w {{ cityDetails.city_name_inflect }} na Google Maps
          </p>
          <UButton
              :to="mapLink"
              icon="i-lucide-map"
              size="lg"
              target="_blank"
          >
            Otwórz mapę
          </UButton>
        </div>


        <!-- Google Maps section -->
        <div class="space-y-4">
          <h2 class="text-2xl font-bold">Pobliskie miejscowości</h2>
          <p class="text-gray-500 dark:text-gray-400">
            Podrzucam jeszcze listę najbliższych miejscowości która mam w bazie na wypadek gdybym przegapił jakiś ER
          </p>

          <div class="my-4 py-4 flex flex-wrap gap-2">
            <UButton
                v-for="(city, index) in nearbyCities"
                :key="index"
                @click="redirectToExternalPage(`/escape-rooms/${city.name}`)"
            >{{ city.name }}
            </UButton>
          </div>
        </div>
      </section>
    </template>
  </UContainer>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import type {CityDetailsResponse} from '~/client/types.gen'
import {
  getCityDetailsPlacesCityAsciiNameGet,
  getNearbyCitiesPlacesNearbyCityCityAsciiNameGet,
  getRoomsByLocationPlacesRoomsLocationNameGet,
  getRoomsCountRoomsCountGet,
  getRoomsNearbyRoomsNearbyCityAsciiNameGet
} from "~/client"

// State
const localePath = useLocalePath()
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const citySlug = computed(() => {
  const slug = route.params.slug || route.path.split("/").pop();
  return decodeURIComponent(decodeURIComponent(slug));
});

const rooms = ref()
const nearbyRooms = ref()
const nearbyCities = ref()
const roomsCounter = ref(0)
const cityDetails = ref<CityDetailsResponse | null>(null)
const isLoading = ref(true)
const error = ref(false)

// Helper functions
const getTranslation = (room: any) => {
  return room.translation || room.translations?.[0] || null;
}

// API Calls
const fetchCityDetails = async () => {
  try {
    const response = await getCityDetailsPlacesCityAsciiNameGet({
      path: {city_ascii_name: citySlug.value},
      query: {language: "pl", country: "PL"},
    })
    cityDetails.value = response.data ?? null

    if (response?.status === 404) {
      await redirectToExternalPage('escape-rooms/near-me')
    }
  } catch (err) {
    error.value = true
    console.error("Failed to fetch city details:", err)
  }
}

const fetchRooms = async () => {
  try {
    // const response = await roomsByLocationRoomsUrlLanguagePlaceLocationGet({
    //   path: {language: "pl", location: citySlug.value},
    // })
    const response = await getRoomsByLocationPlacesRoomsLocationNameGet({
      path: {location_name: citySlug.value}, query: {language: "pl"},
    })
    rooms.value = response.data

    // If no rooms found, fetch nearby rooms
    if (!rooms.value?.length) {
      await fetchNearbyRooms()
    }
  } catch (err) {
    error.value = true
    console.error("Failed to fetch escape rooms:", err)
  }
}

const fetchNearbyRooms = async () => {
  try {
    const response = await getRoomsNearbyRoomsNearbyCityAsciiNameGet({
      path: {city_ascii_name: citySlug.value}
    })
    nearbyRooms.value = response.data
  } catch (err) {
    console.error("Failed to fetch nearby rooms:", err)
  }
}

const fetchRoomsCount = async () => {
  try {
    const response = await getRoomsCountRoomsCountGet()
    roomsCounter.value = response.data
  } catch (err) {
    console.error("Failed to fetch rooms count:", err)
  }
}

const fetchNearbyCities = async () => {
  try {
    const response = await getNearbyCitiesPlacesNearbyCityCityAsciiNameGet({
      path: {city_ascii_name: citySlug.value}
    })
    nearbyCities.value = response.data
  } catch (err) {
    console.error("Failed to fetch rooms count:", err)
  }
}

// Initialize data
const initializeData = async () => {
  isLoading.value = true
  error.value = false

  try {
    await Promise.all([
      fetchCityDetails(),
      fetchRooms(),
      fetchRoomsCount(),
      fetchNearbyCities()
    ])
  } finally {
    isLoading.value = false
  }
}

// Computed
const mapLink = computed(() => {
  if (cityDetails.value?.lat && cityDetails.value?.lon) {
    return `https://www.google.com/maps/search/escape+room/@${cityDetails.value.lat},${cityDetails.value.lon},13z`
  }
  return 'https://www.google.com/maps/search/escape+room?zoom=13'
})

const redirectToExternalPage = async (path: string, uuid?: string) => {
  const query = uuid ? {uuid} : {};

  await navigateTo({
    path: localePath(path),
    query
  });
};
// Initialize
initializeData()

// SEO
const city = computed(() => cityDetails.value?.city_name || citySlug || 'Twoje Miasto');
const canonicalUrl = `${runtimeConfig.public.baseDomain}${route.fullPath}`;
const hreflangLinks = [
  {rel: 'alternate', hreflang: 'pl', href: `${runtimeConfig.public.baseDomain}${route.fullPath}`},
];

useHead({
  link: [
    {rel: 'canonical', href: canonicalUrl},
    ...hreflangLinks,
  ],
  htmlAttrs: {
    lang: 'pl',
  },
});
useSeoMeta({
  title: computed(() => `Escape Room ${city.value} - Katalog i Analizy Najlepszych Escape Roomów`),
  ogTitle: computed(() => `Escape Room ${city.value} - Katalog i Analizy Najlepszych Escape Roomów`),
  description: computed(() => `Znajdź najlepsze escape roomy w ${city.value}! Przeglądaj katalog, porównuj oferty, sprawdzaj poziom trudności, tematy i opinie graczy. Wybierz idealną przygodę w swoim mieście!`),
  ogDescription: computed(() => `Znajdź najlepsze escape roomy w ${city.value}! Przeglądaj katalog, porównuj oferty, sprawdzaj poziom trudności, tematy i opinie graczy. Wybierz idealną przygodę w swoim mieście!`),
});
</script>

<style scoped>
</style>