<template>
  <header class="flex items-center justify-between px-4 py-2 shadow-md">
    <!-- Navigation Links -->
    <nav>
      <ul class="flex gap-4">
        <li>
          <NuxtLinkLocale to="/" active-class="text-primary" class="hover:text-primary">Start</NuxtLinkLocale>
        </li>
        <li>
          <NuxtLinkLocale to="/er_game" active-class="text-primary" class="hover:text-primary">Wirtualny Escape Room</NuxtLinkLocale>
        </li>
        <li>
          <NuxtLinkLocale :to="runtimeConfig.public.blogUrl" active-class="text-primary" class="hover:text-primary">Blog</NuxtLinkLocale>
        </li>
      </ul>
    </nav>

    <!-- Dark Mode Toggle -->
    <div>
      <UButton
          @click="toggleDarkMode"
          class="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-700 dark:hover:bg-gray-100"
          :aria-label="`Switch to ${colorMode.preference === 'dark' ? 'light' : 'dark'} mode`"
          :icon="colorMode.preference === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
      >
      </UButton>
    </div>
  </header>
</template>

<script setup lang="ts">


// Access runtime configuration
const runtimeConfig = useRuntimeConfig()

// Use Nuxt's color mode composable
const colorMode = useColorMode()

// Toggle light/dark mode
const toggleDarkMode = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>

<style>
header {
  background-color: var(--ui-background);
  color: var(--ui-text);
  padding: 1rem;
  margin-bottom: 3rem;
}

nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

nav li {
  display: inline-block;
}

a {
  text-decoration: none;
  color: inherit;
}

a:hover {
  text-decoration: underline;
}

.text-primary {
  color: var(--ui-primary);
}
</style>
