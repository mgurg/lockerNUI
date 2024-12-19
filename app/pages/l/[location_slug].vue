<template>
  <div>
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Kraków</h1>
    <div v-for="(mail, index) in mails" :key="index">
      <div class="p-4 text-md cursor-pointer border-2 border-slate-700 text-gray-600 dark:text-gray-300"
           @click="redirectToExternalPage">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 font-semibold py-2  text-lg">
            <!--          Name-->
            Fabryka Potworów: Detektywistyczna przygoda
            <UChip/>
          </div>
          <!--        <span>12:14</span>-->
        </div>
        <!--      <p class="font-normal">-->
        <!--        🔍 Zbadaj zniknięcie Amelii i odkryj mroczną tajemnicę-->
        <!--      </p>-->
        <p class="text-gray-400 dark:text-gray-500 line-clamp-2">
          🔍 Zbadaj zniknięcie Amelii i odkryj mroczną tajemnicę
        </p>
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
          <!--              icon="i-lucide-triangle-alert"-->
          <!--              size="lg"-->
          <!--              color="primary"-->
          <!--              variant="solid"-->
          <!--              :trailing="false"-->
          <!--          />-->
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>

const localePath = useLocalePath()

const mails = ref([1, 2, 3, 4, 5]);

const redirectToExternalPage = async () => {
  await navigateTo({
    path: localePath('/room_page')
  });
};

</script>


<style scoped>

</style>