<template>
  <header>
    <nav>
      <ul>
        <li>
          <NuxtLink to="/">Start</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/companies">Firmy</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style>
header {
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}
</style>
