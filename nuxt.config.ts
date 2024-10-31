// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxt/ui'],
    runtimeConfig: {
        // Private keys are only available on the server
        // apiSecret: '123'
        
        // Public keys that are exposed to the client
        public: {
          blogUrl: process.env.NUXT_PUBLIC_BLOG_URL || 'https://default-blog-url.com',
        }
      },
    future: {
        compatibilityVersion: 4,
    },
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true}
})
