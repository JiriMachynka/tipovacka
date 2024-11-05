<script lang="ts" setup>
const supabaseClient = useSupabaseClient();

const route = useRoute();

const tournamentId = +route.params.id;
const currentPageTitle = computed(() => route.path.split('/').pop());

const colorMode = useColorMode();

const { $client } = useNuxtApp();

const { data: tournament } = await $client.tournament.getData.useQuery({ tournamentId });
const isAuthor = tournament.value?.data.isAuthor;
const { items, adminItems } = useNavigation(tournamentId);

const mobileNav = ref(false);

const logout = async () => {
	mobileNav.value = false;
	await supabaseClient.auth.signOut();
	navigateTo('/');
};
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
      <li
        v-for="item in items"
        :key="item.text"
        :class="cn('lg:inline-flex', { 'hidden': !mobileNav })"
      >
        <Button
          variant="ghost"
          class="w-full text-xl lg:text-lg py-3 font-bold"
          as-child
        >
          <NuxtLink :to="item.link" @click="() => (mobileNav = false)"> 
            {{ item.text }}
          </NuxtLink>
        </Button>
      </li>
      <li v-if="isAuthor" class="hidden lg:inline-flex"> 
        <AdminDropdownMenu :items="adminItems" />
      </li>
      <li
        v-for="item in adminItems"
        :key="item.text"
        v-if="isAuthor"
        :class="cn('lg:hidden', {
          'hidden': !mobileNav,
          'block': mobileNav,
        })"
      >
        <Button
          variant="ghost"
          class="w-full text-xl py-3 font-bold"
          as-child
        >
          <NuxtLink :to="item.link" @click="() => (mobileNav = false)">
            {{ item.text }}
          </NuxtLink>
        </Button>
      </li>
      <li :class="cn({ 
          'lg:block': !mobileNav, 
          'lg:hidden block': mobileNav 
        })"
      >
        <Button
          variant="ghost"
          :class="cn('w-full py-3 font-bold text-xl', {
            'lg:text-lg': !mobileNav,
            'hover:cursor-pointer': mobileNav,
          })"
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
        'ml-auto': mobileNav,
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
