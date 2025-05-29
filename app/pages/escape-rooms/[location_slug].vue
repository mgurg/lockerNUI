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
          <RoomCardComponent
              v-for="room in rooms"
              :key="room.uuid"
              :room="room"
              @navigate="redirectToExternalPage"
          />
        </TransitionGroup>
      </section>

      <!-- No rooms in city section -->
      <section v-else-if="cityDetails" class="space-y-8">
        <CityIntroComponent :city-details="cityDetails" />

        <UAlert
            title="Brak pokoi w bazie"
            :description="`Na tą chwilę mamy w bazie ${roomsCounter} pokoi zagadek w innych miastach. Sprawdź dostępne pokoje w okolicy!`"
            color="warning"
        />

        <!-- Virtual escape room section -->
        <VirtualEscapeRoomComponent />

        <!-- Nearby rooms section -->
        <div v-if="nearbyRooms?.length" class="space-y-4">
          <SectionHeaderComponent title="Najbliższe escape room-y">
            Sprawdź dostępne pokoje w pobliskich miastach:
          </SectionHeaderComponent>

          <TransitionGroup name="list" tag="div" class="space-y-4">
            <RoomCardComponent
                v-for="room in nearbyRooms"
                :key="room.uuid"
                :room="room"
                :show-location="true"
                @navigate="redirectToExternalPage"
            />
          </TransitionGroup>
        </div>


        <!-- Google Maps section -->
        <GoogleMapsSectionComponent 
          :map-link="mapLink"
          :description="`Sprawdź dostępne escape room-y w ${cityDetails.city_name_inflect} na Google Maps`"
        />


        <!-- Nearby locations section -->
        <NearbyLocationsComponent 
          :cities="nearbyCities"
          @navigate="redirectToExternalPage"
        />
      </section>
    </template>
  </UContainer>
</template>

<script setup lang="ts">
import {computed, nextTick, ref} from 'vue'
import type {CityDetailsResponse} from '~/client/types.gen'
import {
  getCityDetailsPlacesCityAsciiNameGet,
  getNearbyCitiesPlacesNearbyCityCityNameGet,
  getRoomsByLocationPlacesRoomsLocationNameGet,
  getRoomsCountRoomsCountGet,
  getRoomsNearbyRoomsNearbyCityNameGet,
} from "~/client"
import RoomCardComponent from '~/components/RoomCardComponent.vue'
import SectionHeaderComponent from '~/components/SectionHeaderComponent.vue'
import GoogleMapsSectionComponent from '~/components/GoogleMapsSectionComponent.vue'
import NearbyLocationsComponent from '~/components/NearbyLocationsComponent.vue'
import VirtualEscapeRoomComponent from '~/components/VirtualEscapeRoomComponent.vue'
import CityIntroComponent from '~/components/CityIntroComponent.vue'

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
    });
    cityDetails.value = response.data ?? null;
    // TODO: redirect to near-me page if city not found
    // if (!cityDetails.value) {
    // if (response?.status === 404) {
    //   await redirectToExternalPage('escape-rooms/near-me');
    // }
  } catch (err) {
    error.value = true;
    console.error("Failed to fetch city details:", err);
  }
};

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
    const response = await getRoomsNearbyRoomsNearbyCityNameGet({
      path: {city_name: citySlug.value}
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
    const response = await getNearbyCitiesPlacesNearbyCityCityNameGet({
      path: {city_name: citySlug.value}
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
  const query = uuid ? {uuid} : {}

  await nextTick()
  await navigateTo({
    path: localePath(path),
    query
  })
}

// Initialize
initializeData()

// SEO
const city = computed(() => {
  const name = cityDetails.value?.city_name || citySlug.value || 'Twoje Miasto';
  console.log(name)
  return name.replace(/([^\s-])([^\s-]*)/gu, (_, first, rest) =>
      first.toUpperCase() + rest.toLowerCase()
  );
});

const canonicalUrl = `${runtimeConfig.public.baseDomain}${route.fullPath}`;
const hreflangLinks = [
  {rel: 'alternate', hreflang: 'pl', href: canonicalUrl},
  {rel: 'alternate', hreflang: 'x-default', href: canonicalUrl}
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
  title: computed(() => `Escape Room w ${city.value} - katalog pokoi zagadek`),
  ogTitle: computed(() => `Escape Room w ${city.value} - katalog pokoi zagadek`),
  description: computed(() => `Znajdź najlepsze escape roomy w ${city.value}! Przeglądaj katalog, porównuj oferty, sprawdzaj poziom trudności, tematy i opinie graczy. Wybierz idealną przygodę w swoim mieście!`),
  ogDescription: computed(() => `Znajdź najlepsze escape roomy w ${city.value}! Przeglądaj katalog, porównuj oferty, sprawdzaj poziom trudności, tematy i opinie graczy. Wybierz idealną przygodę w swoim mieście!`),
  ogImage: '/og/er_a.jpg',
  twitterCard: 'summary_large_image',
  twitterImage: '/og/er_a.jpg',
});
</script>

<style scoped>
</style>
