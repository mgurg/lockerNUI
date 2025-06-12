<template>
  <UContainer>
    <UCard>
      <template #header>
        <h1 class="text-4xl font-extrabold">{{ t('homepage.title') }}</h1>
      </template>
      {{ t('homepage.blogIntro') }}
      <ULink as="button" :href="runtimeConfig.public.blogUrl">{{ t('common.blog') }}</ULink>
      {{ t('homepage.blogOutro') }}
    </UCard>

    <UCard class="mt-5">
      <template #header>
        <h2 class="text-3xl">{{ t('homepage.virtualTitle') }}</h2>
      </template>

      {{ t('homepage.virtualDescription') }}

      {{ t('homepage.virtualFooter') }}

      <template #footer>
        <UButton :to="localePath('/er_game')">{{ t('homepage.startGame') }}</UButton>
      </template>
    </UCard>

    <UCard class="mt-5" v-if="cities && cities.length">
      <template #header>
        <h2 class="text-3xl">{{ t('homepage.listTitle') }}</h2>
      </template>

      {{ t('homepage.listDescription') }}
      <div class="my-4 py-4 flex flex-wrap gap-2">
        <UButton
            v-for="(city, index) in cities"
            :key="index"
            :to="localePath(`/escape-rooms/${city.ascii_name}`)"
        >{{ city.city }}
        </UButton>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup>
import { useI18n } from "vue-i18n"

const runtimeConfig = useRuntimeConfig()
const localePath = useLocalePath()
const { t } = useI18n()

import {getPlacesWithRoomsPlacesGet} from "@/client/index.ts";

const cities = ref()

const fetchCities = async () => {
  const response = await getPlacesWithRoomsPlacesGet({
    query: {country: "pl"},
  });

  if (response.data) {
    cities.value = response.data;  // Access the data field of the response
  }
}

fetchCities()

useSeoMeta({
  title: t('homepage.seo.title'),
  ogTitle: t('homepage.seo.title'),
  description: t('homepage.seo.description'),
  ogDescription: t('homepage.seo.description'),
  ogImage: '/og/er_a.jpg',
  twitterCard: 'summary_large_image',
  twitterImage: '/og/er_a.jpg',
})
</script>


<style scoped>
</style>
