<template>
  <header>
    <nav>
      <ul>
        <li>
          <NuxtLinkLocale
              :to="'/'"
              :class="{ active: $route.path === '/pl' }"
              class="nav-link"
          >
            Start
          </NuxtLinkLocale>
        </li>
        <li>
          <NuxtLinkLocale
              :to="'/er_game'"
              :class="{ active: $route.path === '/pl/er_game' }"
              class="nav-link"
          >
            Wirtualny Escape Room
          </NuxtLinkLocale>
        </li>
        <li>
          <NuxtLinkLocale
              :to="runtimeConfig.public.blogUrl"
              :class="{ active: $route.path === runtimeConfig.public.blogUrl }"
              class="nav-link"
          >
            Blog
          </NuxtLinkLocale>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
/* Base header styles */
header {
  padding: 1rem;
  margin-bottom: 3rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: var(--ui-background);
}

/* Navigation styles */
nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: var(--ui-text);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

.nav-link:hover {
  background-color: var(--ui-primary-hover);
  color: var(--ui-primary-text-hover);
}

/* Active link styling */
.nav-link.active {
  background-color: var(--ui-primary);
  color: var(--ui-primary-text);
}
</style>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const runtimeConfig = useRuntimeConfig()
const $route = useRoute()
</script>
