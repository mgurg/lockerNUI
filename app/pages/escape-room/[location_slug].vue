<template>
  <div>
    <div v-if="rooms && rooms.length > 0">
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
    <div v-else>
      <h1 class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Escape room w `Kraków`
      </h1>
      <p class="text-gray-500 dark:text-gray-400">Widzę, że szukasz escape room w mieście `Kraków`! To urokliwe miasto w
        województwie pomorskim, pełne historii i wspaniałych miejsc do odkrycia. </p>

      <p class="text-gray-500 dark:text-gray-400">Na tą chwilę mamy w bazie `0` pokoi zagadek w tym mieście. Dlaczego?
        Ponieważ dopiero zaczynam budować bazę pokoi. Łącznie mamy dodanych na razie `0` pokoi, więć jak widzisz ciężko
        jest coś z tego dopasować dla Twojego miasta :)

        Ale nic się nie martw, nie zostawię cie bęz rozwiązania</p>

      <h2 class="my-4 text-xl">Wirtualny escape room</h2>
      <p class="text-gray-500 dark:text-gray-400">Zachęcam Cię do wirtualnego escape room generowanego przez ChatGPT dla
        Ciebie</p>

      <p class="text-gray-500 dark:text-gray-400">Wpisujesz dowolną scenografie i tematykę i możesz spróbować się
        wydostać z rzeczywistości wykreowanej przez sztuczną inteligencję</p>

      <h2 class="my-4 text-xl">Escape room w pobliżu Kraków</h2>
      <p class="text-gray-500 dark:text-gray-400">W naszej bazie (pamiętaj mamy na razie 0 rekordów) najbliższe miasto
        gdzie jest Escape Room to Kraków. Odległość do niego to około 300 km. Trochę sporo więć może warto rozważyć ten
        wirtualny ER o którym mówiłem Ci wcześniej?</p>

      <h2 class="my-4 text-xl">Escape room dla x osób w Kraków dla dzieci, na kawalerski itd.</h2>
      <p class="text-gray-500 dark:text-gray-400">Rozumiem, potrzebujesz wybrać się gdzieś ze swoimi znajomymi lub z
        rodziną więć w grę wchodzi tylko stacjonarny escape room w Kraków</p>

      <p class="text-gray-500 dark:text-gray-400">Ponieważ pewnie już zapamiętałeś że prawie nie mamy jeszcze nic
        dodane do naszej bazy to odeślę Cię na razie do mapy Google. kliknij w link poniżej a zostaniesz przeniesiony do
        mapy miasta Kraków</p>


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
    console.log(response.data)
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
