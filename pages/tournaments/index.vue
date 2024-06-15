<script lang="ts" setup>
const { toast } = useToast();
const supabaseClient = useSupabaseClient();

const { $client } = useNuxtApp();

const { data: tournaments } = await $client.tournament.getAll.useQuery();

const logout = async () => {
	await supabaseClient.auth.signOut();
	toast({
		title: 'Úspěšně odhlášen',
		description: 'Odhlášení proběhlo úspěšně',
		duration: 1000,
	});

	navigateTo('/');
};
</script>
<template>
  <div class="flex flex-col justify-between items-center h-dvh container">
    <Button class="my-3" @click="logout">
      <IconLogOut class="size-8" />
    </Button>
    <div class="flex flex-col gap-4 w-full overflow-y-auto max-h-[70dvh]">
      <NuxtLink
        v-if="tournaments"
        v-for="tournament in tournaments"
        :key="tournament.id"
        :to="`/tournaments/${tournament.id}`"
        :class="cn('flex items-center justify-between w-full p-5 text-xl rounded-lg text-slate-50 py-10 group bg-gradient-to-r from-slate-900 to-slate-800 hover:text-slate-50 border-2 border-slate-50 transition-all duration-700 mb-2',
          tournaments.length > 1 && 'my-2' 
        )"
      >
        <span>{{ tournament.name }}</span>
        <div class="mr-5 group-hover:mr-0 transition-all ease-in-out duration-300">
          <IconChevronRight class="size-6" /> 
        </div>
      </NuxtLink>
    </div>
    <Button
      :class="cn('text-2xl py-4 w-full',
        tournaments?.length === 0 && 'text-3xl py-7 rounded-xl' 
      )"
      @click="navigateTo('/tournaments/create')" 
    >
      Vytvořit tipovačku
    </Button>
    <div />
  </div>
</template>