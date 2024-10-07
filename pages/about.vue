<template>
  <div>
    <h1>Random Cat Fact</h1>
    <div v-if="data">
      <p>{{ data.fact }}</p>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup>
useHead
({
  title: 'My Cat App',
  meta: [
    {
      name: 'description', content: 'My amazing site.'
    }
  ]
})

useSeoMeta
({
  title: 'My Amazing Site',
  ogTitle: 'My Amazing Site',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})

const {data, pending, error} = await useFetch('https://catfact.ninja/fact')
</script>