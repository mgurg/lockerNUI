<template>
  <UContainer>
    <UCard>
      <template #header>
        <h1 class="text-4xl font-extrabold">Escape roomy w Polsce</h1>
      </template>
      Jeżeli interesuje cię polski rynek ER to na
      <ULink as="button" :href="runtimeConfig.public.blogUrl">blogu</ULink>
      są już pierwsze artykuły 🙂
    </UCard>

    <UCard class="mt-5">
      <template #header>
        <h2 class="text-3xl">Wirtualny escape room</h2>
      </template>

      Wymyśl temat gry i pozwól 🤖 AI stworzyć unikatową rozgrywkę tylko dla Ciebie 🎲.

      Powodzenia w eksperymentowaniu i dobrej zabawy 🙂

      <template #footer>
        <UButton :to="localePath('/er_game')">Rozpocznij grę 🕹️</UButton>
      </template>
    </UCard>

        <UCard class="mt-5">
          <template #header>
            <h2 class="text-3xl">Lista escape room-ów w Polsce</h2>
          </template>

          Do analizy danych o rynku Escape room potrzebowałem zbudować własny katalog pokojów zagadek. Lista jest na razie
          króciutka, ale baza danych będzie rozszerzana co miesiąc. Dostępne miasta:
          <div class="my-4 py-4 flex flex-wrap gap-2">
            <UButton
                v-for="(city, index) in cities"
                :key="index"
                :to="localePath(`/escape-room/${city.ascii_name}`)"
            >{{ city.city }}
            </UButton>
          </div>
        </UCard>
  </UContainer>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const localePath = useLocalePath()

import {getPlacesWithRoomsPlacesGet} from "@/client/index.ts";

const cities = ref()

const fetchCities = async () => {
  const response = await getPlacesWithRoomsPlacesGet({
    query: {country: "pl"},
  });
  cities.value = response.data;  // Access the data field of the response
}

fetchCities()

useSeoMeta({
  title: 'Escape Roomy Polska - Katalog, Analizy i Wirtualne Przygody z AI',
  ogTitle: 'Escape Roomy Polska - Katalog, Analizy i Wirtualne Przygody z AI',
  description: 'Odkryj najlepsze escape roomy w Polsce! Porównuj oferty w katalogu, czytaj analizy i przetestuj  wirtualny ER generowany przez ChatGPT. Znajdź idealny escape room dla siebie i swoich znajomych!',
  ogDescription: 'Odkryj najlepsze escape roomy w Polsce! Porównuj oferty w katalogu, czytaj analizy i przetestuj  wirtualny ER generowany przez ChatGPT. Znajdź idealny escape room dla siebie i swoich znajomych!',
})
</script>


<style scoped>
</style>
