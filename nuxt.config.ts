// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
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

  compatibilityDate: '2024-04-03',
  devtools: { enabled: true }
})
