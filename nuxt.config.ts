// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@sidebase/nuxt-auth', 'nuxt-headlessui', 'nuxt3-notifications', '@pinia/nuxt', '@nuxtjs/cloudinary', '@formkit/nuxt', '@nuxt/image'],
  runtimeConfig: {
    public: {},
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    nuxtSecret: process.env.NUXTAUTH_SECRET
  },
  auth: {
    provider: {
      type: 'authjs'
    },
    isEnabled: true,
    baseUrl: process.env.AUTH_ORIGIN,
  },
  formkit: {
    // Experimental support for auto loading (see note):
    autoImport: true
  },
})