<template>
  <div>
    <UCard>
      <template #header>
        <div class="flex items-center gap-3 font-semibold py-2  text-2xl"> Fabryka Potworów: Detektywistyczna przygoda
        </div>
        <div class="space-x-4 pt-2">
          <UButton>Zarezerwuj</UButton>
          <UButton>Zadzwoń</UButton>
        </div>
      </template>
      <div>
        Czy pamiętasz Amelię, córkę Waszej bliskiej przyjaciółki? Od kilku dni nie ma z nią żadnego kontaktu, a jej
        nagłe zniknięcie wywołało falę niepokoju wśród rodziny. Amelia miała spędzić ostatni weekend u swojego ojca,
        Marka, który mieszka w pobliżu, jednak od tamtej pory słuch po niej zaginął. Zdeterminowani, by pomóc w
        poszukiwaniach, postanawiacie odwiedzić jego dom.

        Na miejscu czeka Was szok – drzwi są oklejone policyjną taśmą. Jednak ani na chwilę nie wątpicie w swoją
        decyzję. Musicie działać szybko i sprytnie, by nie zwrócić na siebie uwagi. Każda minuta jest na wagę złota, a
        wskazówki, które znajdziecie, mogą okazać się kluczowe w rozwiązaniu tajemnicy zniknięcia Amelii.

        Doświadcz niezapomnianych emocji w jednym z najbardziej wciągających escape roomów w Warszawie. Czy uda Wam się
        rozwikłać zagadkę, zanim będzie za późno? Przekonajcie się sami! Zarezerwujcie swoją grę już teraz i
        przygotujcie się na prawdziwy dreszczowiec.
      </div>


      <template #footer>
        <div class="text-gray-400 dark:text-gray-500 line-clamp-1 space-x-4 pt-2">
          <UBadge
              icon="i-lucide-clock"
              size="lg"
              color="primary"
              variant="solid"
              label="90'"
              :trailing="false"
          />
          <UBadge
              icon="i-lucide-users"
              size="lg"
              color="primary"
              variant="solid"
              label="2-6"
              :trailing="false"
          />
          <!--          <UBadge-->
          <!--              icon="i-heroicons-exclamation-triangle"-->
          <!--              size="lg"-->
          <!--              color="primary"-->
          <!--              variant="solid"-->
          <!--              :trailing="false"-->
          <!--          />-->
        </div>
      </template>
    </UCard>
    <div>
      <UAccordion :items="items"/>
    </div>

  </div>
</template>

<script setup>
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