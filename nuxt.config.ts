// nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/assets/scss/main.scss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    '@vuestic/nuxt'
  ],

  vuestic: {
    config: {
      // Vuestic config here
    },

    css: ['typography'],
  },

  app: {
    head: {
      link: [
        {
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
          rel: "stylesheet",
        }
      ],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },

  compatibilityDate: '2024-04-03',
  devtools: { enabled: true }
})
