<template>
  <header class="flex items-center justify-between px-4 py-2 shadow-md">
    <!-- Navigation Links -->
    <nav>
      <ul class="flex gap-4">
        <li>
          <NuxtLinkLocale to="/" active-class="text-primary" class="hover:text-primary">{{ $t('common.navigation.start') }}</NuxtLinkLocale>
        </li>
        <li>
          <NuxtLinkLocale to="/er_game" active-class="text-primary" class="hover:text-primary">{{ $t('common.navigation.virtualEscapeRoom') }}</NuxtLinkLocale>
        </li>
        <li>
          <NuxtLinkLocale :to="runtimeConfig.public.blogUrl" active-class="text-primary" class="hover:text-primary">{{ $t('common.navigation.blog') }}</NuxtLinkLocale>
        </li>
      </ul>
    </nav>

    <!-- Dark Mode Toggle and Language Switcher -->
    <div class="flex items-center gap-2">
      <!-- Language Switcher -->
      <div class="flex items-center gap-2">
        <UButton
            v-for="locale in availableLocales"
            :key="locale.code"
            @click="switchLanguage(locale.code)"
            class="flex items-center gap-2 px-3 py-2 border rounded-md"
            :class="{ 'bg-primary text-white': locale.code === currentLocale }"
        >
          {{ locale.code.toUpperCase() }}
        </UButton>
      </div>

      <!-- Dark Mode Toggle -->
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
import { computed } from 'vue'

// Access runtime configuration
const runtimeConfig = useRuntimeConfig()

// Use Nuxt's color mode composable
const colorMode = useColorMode()

// Toggle light/dark mode
const toggleDarkMode = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}

// i18n setup
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

// Get available locales
const availableLocales = computed(() => {
  return (locales.value as any[]).map(l => ({
    code: l.code,
    name: l.name
  }))
})

// Get current locale
const currentLocale = computed(() => locale.value)

// Switch language
const switchLanguage = (localeCode: string) => {
  const path = switchLocalePath(localeCode)
  if (path) {
    router.push(path)
  }
}
</script>

<style scoped>
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
