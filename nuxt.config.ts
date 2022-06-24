import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  meta: {
    title: 'A Better Nuxt 3 Starter',
  },
  buildModules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
  ],
  css: ['~/assets/styles.css'],
})
