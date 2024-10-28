<script lang="ts" setup>
const supabaseClient = useSupabaseClient();

const route = useRoute();

const tournamentId = +route.params.id;
const currentPageTitle = computed(() => route.path.split('/').pop());

const colorMode = useColorMode();

const { $client } = useNuxtApp();

const { data: tournament } = await $client.tournament.getData.useQuery({ tournamentId });

const mobileNav = ref(false);

const logout = async () => {
	mobileNav.value = false;
	await supabaseClient.auth.signOut();
	navigateTo('/');
};
// TODO: Make nav button a single component
</script>
<template>
  <div :class="cn('lg:relative lg:flex lg:flex-row items-center', {
      'hidden': !mobileNav,
      'fixed left-0 top-0 pt-20 flex flex-col bg-background w-full h-dvh z-50': mobileNav,
    })"
  >
    <nav :class="cn('list-none lg:left-0 lg:top-0 flex justify-center lg:flex-row lg:gap-2 w-full my-3', {
        'flex-col gap-2': mobileNav, 
      })"
    >
      <li :class="cn('lg:block', {  
          'hidden': !mobileNav,
        })"
      >
        <Button
          variant="ghost"
          class="w-full text-xl lg:text-lg py-3 font-bold"
          as-child
        >
          <NuxtLink to="/tournaments" @click="() => (mobileNav = false)">
            Zpět na tipovačky
          </NuxtLink>
        </Button>
      </li>
      <li :class="cn('lg:block', {  
          'hidden': !mobileNav,
        })"
      >
        <Button
          variant="ghost"
          class="w-full text-xl lg:text-lg py-3 font-bold"
          as-child
        >
          <NuxtLink :to="`/tournaments/${tournamentId}/`" @click="() => (mobileNav = false)">
            Tabulka
          </NuxtLink>
        </Button>
      </li>
      <li :class="cn('lg:block', {  
          'hidden': !mobileNav,
        })"
      >
        <Button
          variant="ghost"
          class="w-full text-xl lg:text-lg py-3 font-bold"
          as-child
        >
          <NuxtLink :to="`/tournaments/${tournamentId}/my-tips`" @click="() => (mobileNav = false)">
            Moje tipy
          </NuxtLink>
        </Button>
      </li>
      <li :class="cn('lg:block', {  
          'hidden': !mobileNav,
        })"
      >
        <Button
          variant="ghost"
          class="w-full text-xl lg:text-lg py-3 font-bold"
          as-child
        >
          <NuxtLink :to="`/tournaments/${tournamentId}/leaderboard`" @click="() => (mobileNav = false)">
            Žebříček
          </NuxtLink>
        </Button>
      </li>
      <li v-if="tournament!.data.isAuthor" class="hidden lg:inline-flex"> 
        <DropdownMenu>
          <DropdownMenuTrigger
            :class="cn(buttonVariants({ variant: 'ghost' }),
              'w-full text-lg py-3 inline-flex items-center gap-2 group font-bold'
            )"
          >
            <span>Admin sekce</span>
            <!-- TODO: Make icons animated -->
            <IconChevronUp
              :size="20"
              class="group-data-[state=closed]:hidden group-data-[state=open]:block"
            />
            <IconChevronDown
              :size="20"
              class="group-data-[state=closed]:block group-data-[state=open]:hidden"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent class="flex flex-col max-w-52 w-full">
            <DropdownMenuItem :class="cn(buttonVariants({ variant: 'ghost' }),
                'text-lg font-bold px-5 py-3 hover:cursor-pointer'
              )"
              as-child
            >
              <NuxtLink :to="`/tournaments/${tournamentId}/manage-matches`">
                Spravovat zápasy
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem :class="cn(buttonVariants({ variant: 'ghost' }),
                'text-lg font-bold px-5 py-3 hover:cursor-pointer'
              )"
              as-child
            >
              <NuxtLink :to="`/tournaments/${tournamentId}/manage-teams`">
                Spravovat týmy
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem :class="cn(buttonVariants({ variant: 'ghost' }),
                'text-lg font-bold px-5 py-3 hover:cursor-pointer'
              )"
              as-child
            >
              <NuxtLink :to="`/tournaments/${tournamentId}/manage-scorers`">
                Spravovat střelce
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem :class="cn(buttonVariants({ variant: 'ghost' }),
                'text-lg font-bold px-5 py-3 hover:cursor-pointer'
              )"
              as-child
            >
              <NuxtLink :to="`/tournaments/${tournamentId}/manage-players`">
                Spravovat hráče
              </NuxtLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
      <li v-if="tournament!.data.isAuthor" :class="cn('lg:hidden', { 
          'hidden': !mobileNav,
          'block': mobileNav,
        })"
      >
        <Button
          variant="ghost"
          class="w-full text-xl py-3 font-bold"
          as-child
        >
          <NuxtLink :to="`/tournaments/${tournamentId}/manage-matches`" @click="() => (mobileNav = false)">
            Spravovat zápasy
          </NuxtLink>
        </Button>
      </li>
      <li v-if="tournament!.data.isAuthor" :class="cn('lg:hidden', { 
          'hidden': !mobileNav,
          'block': mobileNav,
        })"
      >
        <Button
          variant="ghost"
          class="w-full text-xl py-3 font-bold"
          as-child
        >
          <NuxtLink :to="`/tournaments/${tournamentId}/manage-teams`" @click="() => (mobileNav = false)">
            Spravovat týmy
          </NuxtLink>
        </Button>
      </li>
      <li v-if="tournament!.data.isAuthor" :class="cn('lg:hidden', { 
          'hidden': !mobileNav,
          'block': mobileNav,
        })"
      >
        <Button
          variant="ghost"
          class="w-full text-xl py-3 font-bold"
          as-child
        >
          <NuxtLink :to="`/tournaments/${tournamentId}/manage-scorers`" @click="() => (mobileNav = false)">
            Spravovat střelce
          </NuxtLink>
        </Button>
      </li>
      <li v-if="tournament!.data.isAuthor" :class="cn('lg:hidden', { 
          'hidden': !mobileNav,
          'block': mobileNav,
        })"
      >
        <Button
          variant="ghost"
          class="w-full text-xl py-3 font-bold"
          as-child
        >
          <NuxtLink :to="`/tournaments/${tournamentId}/manage-players`" @click="() => (mobileNav = false)">
            Spravovat hráče
          </NuxtLink>
        </Button>
      </li>
      <li :class="cn('lg:block', {
          'hidden': !mobileNav,
        })"
      >
        <Button
          variant="ghost"
          class="w-full text-xl lg:text-lg py-3 font-bold"
          @click="logout"
        >
          Odhlásit se
        </Button>
      </li>
      <li :class="cn('lg:hidden', {
          'block': !mobileNav,
          'hidden': mobileNav,
        })"
      >
        <Button
          variant="ghost"
          class="w-full text-xl py-3 hover:cursor-pointer"
          @click="logout"
        >
          Odhlásit se
        </Button>
      </li>
    </nav>
  </div>
  <div :class="cn('items-center w-full', {
      'grid grid-cols-[auto_1fr_auto]': !mobileNav,
      'flex': mobileNav,
    })"
  >
    <div class="size-12 inline-flex lg:hidden" />
    <h2 :class="cn('text-2xl md:text-4xl text-center font-semibold uppercase my-3 lg:hidden lg:mt-0', {
        'inline-flex ': mobileNav,
      })"
    >
      {{ getPageName(currentPageTitle) }}
    </h2>
    <Button 
      :class="cn('z-50 p-2 inline-flex w-fit lg:hidden', {
        'ml-auto fixed': mobileNav,
      })"
      variant="outline"
      aria-controls="mobile-menu"
      :aria-expanded="mobileNav"
      @click="() => (mobileNav = !mobileNav)"
    >
      <IconX
        v-if="mobileNav"
        :size="30"
        :stroke="colorMode.value === 'dark' ? 'white' : 'black'"
      /> 
      <IconMenu
        v-else
        :size="30"
        :stroke="colorMode.value === 'dark' ? 'white' : 'black'"
      />
    </Button>
  </div>
</template>
