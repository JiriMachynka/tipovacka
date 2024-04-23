// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['trpc-nuxt']
  },
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss", 
    "shadcn-nuxt", 
    "@nuxtjs/supabase",
    '@nuxtjs/color-mode'
  ],
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
  components: {
    dirs: [
      '@/components',
      '@/components/ui',
    ]
  },
  runtimeConfig: {
    public: {
      databaseUrl: '',
    }
  },
})