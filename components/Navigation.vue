<script lang="ts" setup>
import { Menu,X, ChevronDown, ChevronUp } from 'lucide-vue-next';

const supabaseClient = useSupabaseClient();

const route = useRoute();

const tournamentId = +route.params.id;
const currentPageTitle = route.path.split('/').pop();

const colorMode = useColorMode();

const user = useSupabaseUser();

const { $client } = useNuxtApp();

const { data: tournament } = await $client.tournament.getData.useQuery({ tournamentId });

const mobileNav = ref(false);

const logout = async () => {
	await supabaseClient.auth.signOut();
	navigateTo('/');
};
// TODO: Make nav button a single component
</script>
<template>
  <div :class="cn('lg:relative lg:flex lg:flex-row items-center', {
      'hidden': !mobileNav,
      'absolute left-0 top-0 pt-20 flex flex-col bg-background w-full h-dvh z-50': mobileNav,
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
          <NuxtLink to="/tournaments">
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
          <NuxtLink :to="`/tournaments/${tournamentId}/`">
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
          <NuxtLink :to="`/tournaments/${tournamentId}/my-tips`">
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
          <NuxtLink :to="`/tournaments/${tournamentId}/leaderboard`">
            Žebříček
          </NuxtLink>
        </Button>
      </li>
        <li v-if="tournament!.data[0].authorId === user?.id" class="hidden lg:inline-flex"> 
          <DropdownMenu>
            <DropdownMenuTrigger
              :class="cn(buttonVariants({ variant: 'ghost' }),
                'w-full text-lg py-3 inline-flex items-center gap-2 group font-bold'
              )"
            >
              <span>Admin sekce</span>
              <!-- TODO: Make icons animated -->
              <ChevronUp
                :size="20"
                class="group-data-[state=closed]:hidden group-data-[state=open]:block"
              />
              <ChevronDown
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
        <li v-if="tournament!.data[0].authorId === user?.id" :class="cn('lg:hidden', { 
            'hidden': !mobileNav,
            'block': mobileNav,
          })"
        >
          <Button
            variant="ghost"
            class="w-full text-xl py-3 font-bold"
            as-child
          >
            <NuxtLink :to="`/tournaments/${tournamentId}/manage-matches`">
              Spravovat zápasy
            </NuxtLink>
          </Button>
        </li>
        <li v-if="tournament!.data[0].authorId === user?.id" :class="cn('lg:hidden', { 
            'hidden': !mobileNav,
            'block': mobileNav,
          })"
        >
          <Button
            variant="ghost"
            class="w-full text-xl py-3 font-bold"
            as-child
          >
            <NuxtLink :to="`/tournaments/${tournamentId}/manage-scorers`">
              Spravovat střelce
            </NuxtLink>
          </Button>
        </li>
        <li v-if="tournament!.data[0].authorId === user?.id" :class="cn('lg:hidden', { 
            'hidden': !mobileNav,
            'block': mobileNav,
          })"
        >
          <Button
            variant="ghost"
            class="w-full text-xl py-3 font-bold"
            as-child
          >
            <NuxtLink :to="`/tournaments/${tournamentId}/manage-players`">
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
      'grid grid-cols-[1fr_auto]': !mobileNav,
      'flex': mobileNav,
    })"
  >
    <h2 :class="cn('text-4xl text-center font-semibold uppercase my-3 lg:hidden lg:mt-0', {
          'inline-flex ': mobileNav,
        }
      )"
    >
      {{ getPageName(currentPageTitle) }}
    </h2>
    <Button 
      :class="cn('m-2 z-50 p-2 inline-flex w-fit', {
        'ml-auto': mobileNav,
      })"
      variant="outline"
      aria-controls="mobile-menu"
      :aria-expanded="mobileNav"
      @click="() => (mobileNav = !mobileNav)"
    >
      <X
        v-if="mobileNav"
        :size="30"
        :stroke="colorMode.value === 'dark' ? 'white' : 'black'"
      /> 
      <Menu
        v-else
        :size="30"
        :stroke="colorMode.value === 'dark' ? 'white' : 'black'"
      />
    </Button>
  </div>
</template>
