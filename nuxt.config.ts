// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxt/ui', 'nuxt-umami', '@nuxtjs/i18n'],
    umami: {
        id: 'my-w3b517e-id',
        host: 'https://my-umami.xyz',
        autoTrack: true,
        // proxy: 'cloak',
        // useDirective: true,
        // ignoreLocalhost: true,
        // excludeQueryParams: false,
        // domains: ['cool-site.app', 'my-space.site'],
        // customEndpoint: '/my-custom-endpoint',
        // enabled: false,
        // logErrors: true,
    },
    i18n: {
        strategy: 'prefix',
        locales: ['en', 'pl'],
        defaultLocale: 'pl'
    },
    runtimeConfig: {
        // Private keys are only available on the server
        // apiSecret: '123'

        // Public keys that are exposed to the client
        public: {
            blogUrl: process.env.NUXT_PUBLIC_BLOG_URL || 'https://default-blog-url.com',
            apiBaseUrl: process.env.NUXT_BACKEND_API || 'http://localhost:5000',
        }
    },
    future: {
        compatibilityVersion: 4,
    },
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true}
})