// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    'vue-easy-dnd/dist/dnd.css',
  ],
  build: {
    transpile: [
      'trpc-nuxt',
      'dayjs-nuxt',
    ]
  },
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    '@nuxtjs/color-mode',
    "shadcn-nuxt",
    "dayjs-nuxt",
    "@nuxt/image",
    '@vee-validate/nuxt',
    'nuxt-lucide-icons',
  ],
  app: {
    head: {
      title: 'Moje Tipovačka',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { name: 'description', content: 'Moje Tipovačka' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/css/flag-icons.min.css' }
      ]
    },
  },
  lucide: {
    namePrefix: 'icon',
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
      './components/ui/toast',
      './components/ui/button',
    ]
  },
  runtimeConfig: {
    public: {
      databaseUrl: '',
    }
  },
})