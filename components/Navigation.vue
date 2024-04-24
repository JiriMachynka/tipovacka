<script lang="ts" setup>
import { X, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { buttonVariants } from './ui/button';

const supabaseClient = useSupabaseClient();

const route = useRoute();

const tournamentId = route.params.id;
const currentPageTitle = route.path.split('/').pop();

const user = useSupabaseUser();

const { $client } = useNuxtApp();
const { data: tournament } = await $client.tournament.getData.useQuery({ tournamentId: +tournamentId });

const mobileNav = ref(false);

const adminMenuOpen = ref(false);

const logout = async () => {
	await supabaseClient.auth.signOut();
	navigateTo('/');
};
</script>
<template>
  <div :class="cn('lg:relative lg:flex lg:flex-row items-center', {
      'hidden': !mobileNav,
      'absolute left-0 top-0 pt-20 w-full flex flex-col bg-background': mobileNav,
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
          class="w-full text-xl lg:text-lg py-3"
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
          class="w-full text-xl lg:text-lg py-3"
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
          class="w-full text-xl lg:text-lg py-3"
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
          class="w-full text-xl lg:text-lg py-3"
          as-child
        >
          <NuxtLink :to="`/tournaments/${tournamentId}/leaderboard`">
            Žebříček
          </NuxtLink>
        </Button>
      </li>
        <li v-if="tournament!.data[0].authorId === user?.id" class="hidden lg:inline-flex"> 
          <DropdownMenu v-model:open="adminMenuOpen" closeOnItemClick> 
            <DropdownMenuTrigger
              v-auto-animate 
              :class="cn(buttonVariants({ variant: 'ghost' }), 
                'w-full text-lg py-3 inline-flex items-center gap-2'
              )"
            >
              <span>Admin sekce</span>
              <!-- TODO: Make icons animated -->
              <ChevronUp v-if="adminMenuOpen" :size="20" />
              <ChevronDown v-else :size="20" />
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
            class="w-full text-xl py-3"
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
            class="w-full text-xl py-3"
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
            class="w-full text-xl py-3"
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
          class="w-full text-xl lg:text-lg py-3"
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
    <button :class="cn('m-2 z-50 p-2 text-slate-50 rounded-lg lg:hidden hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-200', {
          'ml-auto': mobileNav,
        })"
      aria-controls="mobile-menu"
      aria-expanded="false"
      @click="() => (mobileNav = !mobileNav)"
    >
      <X v-if="mobileNav" :size="30" /> 
      <svg
        v-else
        width="30"
        height="30"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </button>
  </div>
</template>
