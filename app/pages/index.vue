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
      <div class="my-4">
        <UButton :to="localePath('l/krakow')">🐉 Kraków</UButton>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const localePath = useLocalePath()
</script>

<style scoped>
</style>
