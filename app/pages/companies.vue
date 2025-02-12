<template>
  <div>
    <div class="relative bg-black text-white">
      <!-- Hero Section (Limited to 1/3 height) -->
      <div class="relative w-full h-[33vh] overflow-hidden">
        <!-- Fading Effect Over Image -->
        <div class="absolute inset-0 bg-gradient-to-l from-black/50 via-transparent to-black z-10"></div>

        <!-- Background Gradient (Only if Image Fails) -->
        <div id="fallback-bg" class="absolute inset-0 bg-gradient-to-b from-gray-900 to-black hidden"></div>

        <img
            src="https://picsum.photos/1200/800"
            alt="Movie Hero"
            class="object-cover w-full h-full"
            onerror="document.getElementById('fallback-bg').classList.remove('hidden'); this.style.display='none';"
        />

        <!-- Content Overlay (Inside Image) -->
        <div class="absolute inset-0 flex flex-col justify-end p-5 sm:p-10 z-20">
          <h1 class="text-3xl sm:text-4xl font-bold">Dune: Part Two</h1>
          <p class="text-lg text-gray-300 mt-2">2024 · Directed by Denis Villeneuve</p>

          <p class="mt-4 text-gray-100 hidden sm:block">
            Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen
            while on a path of revenge against the conspirators who destroyed his family.
          </p>

          <!-- Actions -->
          <div class="mt-6 flex space-x-4">
            <UButton color="primary" variant="solid">Rezerwuj</UButton>
            <UButton color="primary" variant="outline">Zadzwoń</UButton>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
