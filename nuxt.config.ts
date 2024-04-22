// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['trpc-nuxt']
  },
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss", 
    "shadcn-nuxt", 
    "@nuxtjs/supabase"
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        "types": ["node"],
      },
    },
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
      {
        path: '@/components',
      },
      {
        path: '@/components/ui',
      },
    ]
  },
  runtimeConfig: {
    public: {
      databaseUrl: '',
    }
  },
})