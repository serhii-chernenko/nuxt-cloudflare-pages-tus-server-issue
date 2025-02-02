import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxthub/core'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      allowedVideoFormats: ['video/mp4', 'video/quicktime'],
    },
  },
  build: {
    transpile: ['tus-js-client'],
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
  vite: {
    plugins: [tailwindcss()],
    // optimizeDeps: {
    //   include: ['tus-js-client'],
    // },
  },
  eslint: {
    checker: true,
  },
})
