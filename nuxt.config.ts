// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxt/ui', 'nuxt-umami', '@nuxtjs/i18n'],
    umami: {
        id: 'my-w3b517e-id',
        host: 'https://cloud.umami.is',
        autoTrack: true,
        // proxy: 'cloak',
        // useDirective: true,
        ignoreLocalhost: true,
        // excludeQueryParams: false,
        // domains: ['cool-site.app', 'my-space.site'],
        // customEndpoint: '/my-custom-endpoint',
        // enabled: false,
        // logErrors: true,
    },
    i18n: {
        strategy: 'prefix',
        locales: [
            {code: 'pl', iso: 'pl-PL', name: 'Polski'},
            // {code: 'en', iso: 'en-US', name: 'English'}
        ],
        defaultLocale: 'pl',
    },
    router: {
        options: {
            linkActiveClass: "active",
            linkExactActiveClass: "exact-active"
        }
    },
    runtimeConfig: {
        // Private keys are only available on the server
        // apiSecret: '123'

        // Public keys that are exposed to the client
        public: {
            blogUrl: process.env.NUXT_PUBLIC_BLOG_URL || 'https://default-blog-url.com',
            baseDomain: process.env.NUXT_PUBLIC_DOMAIN || 'http://localhost:3000',
            apiBaseUrl: process.env.NUXT_BACKEND_API || 'http://localhost:5000',
        }
    },
    future: {
        compatibilityVersion: 4,
    },
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    // nitro: {
    //     routeRules: {
    //         '/api/**': { cors: true },
    //     }
    // }
})