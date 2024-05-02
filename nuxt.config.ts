// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['trpc-nuxt']
  },
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss", 
    "@nuxtjs/supabase",
    '@nuxtjs/color-mode',
    "shadcn-nuxt",
    "dayjs-nuxt",
  ],
  dayjs: {
    locales: ['cs'],
    plugins: ['relativeTime'],
    defaultLocale: 'cs',
  },
  colorMode: {
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