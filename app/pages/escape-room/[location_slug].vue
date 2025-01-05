<template>
  <UContainer>
    <div>
      <div v-if="rooms && rooms.length > 0 && cityDetails">
        <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Escape room-y w Kraków
        </h1>
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
                :label="`${room.game_duration} min`"
                :trailing="false"
                color="primary"
                icon="i-lucide-clock"
                size="lg"
                variant="solid"
            />
            <UBadge
                :label="`${room.players_min}-${room.players_max}`"
                :trailing="false"
                color="primary"
                icon="i-lucide-users"
                size="lg"
                variant="solid"
            />
            <UBadge
                :label="`od ${room.price_from} PLN`"
                :trailing="false"
                color="primary"
                icon="i-lucide-circle-dollar-sign"
                size="lg"
                variant="solid"
            />
          </div>
        </div>
      </div>
      <div v-else-if="cityDetails">
        <h1
            class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Escape room w {{ cityDetails.city_name_inflect }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400">Szukasz <span
            class="font-bold">escape room w mieście {{ cityDetails.city_name }}?</span>
          <span v-if="cityDetails.importance >= 0.60">
      To jedno z najważniejszych miast w Polsce, oferujące bogatą historię i niezapomniane atrakcje.
    </span>
          <span v-else-if="cityDetails.importance >= 0.50">
      To piękne miasto z interesującą historią i miejscami wartymi odwiedzenia.
    </span>
          <span v-else>
      To urokliwe miasteczko, które kryje w sobie wiele ciekawych zakątków do odkrycia.
    </span></p>

        <p class="text-gray-500 dark:text-gray-400">Na tą chwilę mamy w bazie <span
            class="font-bold">0 pokoi zagadek</span> pokoi zagadek w tym mieście. Dlaczego?
          Ponieważ dopiero zaczynam budować bazę pokoi. Łącznie (we wszystkich miastach) mamy dodanych na razie <span
              class="font-bold">0 pokoi</span>, więć jak widzisz ciężko
          jest coś z tego dopasować dla Twojego miasta 😮‍💨

          Ale nic się nie martw, nie zostawię cie bez rozwiązania!</p>

        <h2 class="my-4 text-2xl">Wirtualny escape room</h2>
        <p class="text-gray-500 dark:text-gray-400">Zachęcam Cię do wirtualnego escape room generowanego przez ChatGPT.
          Każda gra jest unikatowa i tworzona tylko i wyłącznie dla Ciebie.</p>

        <p class="text-gray-500 dark:text-gray-400">Wpisujesz dowolną tematykę, podajesz kilka szczegółów i możesz
          spróbować się
          wydostać z rzeczywistości wykreowanej przez sztuczną inteligencję. Spróbuj, <span
              class="font-bold">nie trzeba podawać maila, a całość jes za darmo</span></p>

        <UButton class="my-4" :to="localePath('/er_game')">Rozpocznij grę 🕹</UButton>

        <!--        <h2 class="my-4 text-xl">Escape room w pobliżu {{ cityDetails.city_name }}</h2>-->
        <!--        <p class="text-gray-500 dark:text-gray-400">W naszej bazie (pamiętaj mamy na razie 0 rekordów) najbliższe miasto-->
        <!--          gdzie jest Escape Room to Kraków. Odległość do niego to około 300 km. Trochę sporo więć może warto rozważyć-->
        <!--          ten wirtualny ER o którym mówiłem Ci wcześniej?</p>-->

        <h2 class="my-4 text-2xl">Escape room dla x osób w {{ cityDetails.city_name_inflect }} dla dzieci, na kawalerski
          itd.</h2>
        <p class="text-gray-500 dark:text-gray-400">Rozumiem, potrzebujesz wybrać się gdzieś ze swoimi znajomymi lub z
          rodziną więć w grę wchodzi tylko stacjonarny escape room w {{ cityDetails.city_name_inflect }}</p>

        <p class="text-gray-500 dark:text-gray-400">Ponieważ pewnie już zapamiętałeś, że <span class="line-through">prawie</span>
          nie mamy jeszcze nic
          dodane do naszej bazy. Odeślę Cię na razie do mapy Google. kliknij w link poniżej a zostaniesz przeniesiony
          do mapy miasta {{ cityDetails.city_name }} 🗺️</p>

        <UButton class="my-4" :to="mapLink">Eksploruj mapę escape room-ów w {{ cityDetails.city_name_inflect }}</UButton>


      </div>
      <!--    <div v-else>-->
      <!--      Loading... -->
      <!--    </div>-->


    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type {Ref} from 'vue';
import {ref} from 'vue';
import {detailsPlacesCityAsciiNameGet, roomsByLocationRoomsUrlLanguagePlaceLocationGet,} from "~/client";
import type {CityDetailsResponse} from '~/client/types.gen';

const localePath = useLocalePath()
const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const citySlug = route.params.slug || route.path.split("/").pop();
const rooms = ref();
const cityDetails: Ref<CityDetailsResponse | null> = ref(null);

const mapLink = computed(() => {
  if (cityDetails.value?.lat && cityDetails.value?.lon) {
    return `https://www.google.com/maps/search/escape+room/@${cityDetails.value.lat},${cityDetails.value.lon},13z`;
  }
  return "https://www.google.com/maps/search/escape+room?zoom=13"; // Fallback link
});

const fetchCityDetails = async () => {
  try {
    const response = await detailsPlacesCityAsciiNameGet({
      path: {city_ascii_name: citySlug},
      query: {language: "pl", country: "PL"},
    });
    cityDetails.value = response.data;
  } catch (error) {
    console.error("Failed to fetch city details:", error);
  }
};

const fetchRooms = async () => {
  try {
    const response = await roomsByLocationRoomsUrlLanguagePlaceLocationGet({
      path: {language: "pl", location: citySlug},
    });
    console.log(response.data)
    rooms.value = response.data.data;
  } catch (error) {
    console.error("Failed to fetch escape rooms:", error);
  }
};

fetchCityDetails();
fetchRooms();

const redirectToRoomDetailsPage = async (url) => {
  await navigateTo({
    path: localePath(`/${url}`)
  });
};


const cityName = computed(() => cityDetails.value?.city_name || citySlug || 'Twoje Miasto');
const canonicalUrl = `${runtimeConfig.public.baseDomain}${route.fullPath}`;
const hreflangLinks = [
  { rel: 'alternate', hreflang: 'pl', href: `${runtimeConfig.public.baseDomain}l${route.fullPath}` },
];

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl },
    ...hreflangLinks,
  ],
});
useSeoMeta({
  title: computed(() => `Escape Room ${cityName.value} - Katalog i Analizy Najlepszych Escape Roomów`),
  ogTitle: computed(() => `Escape Room ${cityName.value} - Katalog i Analizy Najlepszych Escape Roomów`),
  description: computed(() => `Znajdź najlepsze escape roomy w ${cityName.value}! Przeglądaj katalog, porównuj oferty, sprawdzaj poziom trudności, tematy i opinie graczy. Wybierz idealną przygodę w swoim mieście!`),
  ogDescription: computed(() => `Znajdź najlepsze escape roomy w ${cityName.value}! Przeglądaj katalog, porównuj oferty, sprawdzaj poziom trudności, tematy i opinie graczy. Wybierz idealną przygodę w swoim mieście!`),
});
</script>

<style scoped>
</style>
