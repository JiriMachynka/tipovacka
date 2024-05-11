// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: [
      'trpc-nuxt',
      'dayjs-nuxt'
    ]
  },
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss", 
    "@nuxtjs/supabase",
    '@nuxtjs/color-mode',
    "shadcn-nuxt",
    "dayjs-nuxt",
  ],
  app: {
    head: {
      title: 'Moje Tipovačka',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { name: 'description', content: 'Moje Tipovačka' },
      ],
    }
  },
  dayjs: {
    locales: ['cs'],
    plugins: ['relativeTime', 'utc'],
    defaultLocale: 'cs',
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: ''
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
  supabase: {
    redirect: false, 
  },
  imports: {
    dirs: [
      './components/**'
    ],
  },
  runtimeConfig: {
    public: {
      databaseUrl: '',
    }
  },
})