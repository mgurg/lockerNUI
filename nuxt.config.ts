// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxt/ui'],
    runtimeConfig: {
        public: {
          BLOG_URL: process.env.BLOG_URL || 'https://default-blog-url.com',
        },
      },
    future: {
        compatibilityVersion: 4,
    },
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true}
})
