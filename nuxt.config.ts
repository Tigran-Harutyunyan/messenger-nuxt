// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    compressPublicAssets: true,
    brotli: true,
    prerender: {
      crawlLinks: true
    }
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@sidebase/nuxt-auth', 'nuxt-headlessui', '@pinia/nuxt', '@nuxtjs/cloudinary', '@formkit/nuxt', '@nuxt/image', '@bg-dev/nuxt-naiveui'],
  runtimeConfig: {
    public: {
      pusherPublicAppKey: process.env.NUXT_PUBLIC_PUSHER_APP_KEY
    },
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    nuxtSecret: process.env.NUXTAUTH_SECRET,
    pusherSecret: process.env.PUSHER_SECRET,
    pusherAppId: process.env.PUSHER_APP_ID,
    pusherPublicAppKey: process.env.NUXT_PUBLIC_PUSHER_APP_KEY

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
  experimental: {
    renderJsonPayloads: false,
  },
  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=500, initial-scale=1',
      title: 'Messenger with Nuxt3',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { name: 'description', content: 'Messenger with Nuxt.js.' },

        { name: 'keywords', content: 'Nuxt Messenger' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'https://static.xx.fbcdn.net/rsrc.php/ym/r/YQbyhl59TWY.ico' }
      ]
    },
  },
  image: {
    domains: ['res.cloudinary.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com']
  }
})