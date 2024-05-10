<script lang="ts" setup>
import { Users, Swords } from 'lucide-vue-next';

const { $client } = useNuxtApp();

const route = useRoute();

const tournamentId = +route.params.id;

const { data: tournament } = await $client.tournament.getData.useQuery({ tournamentId });

const numberOfMatches = tournament.value?.userMatches ? tournament.value?.userMatches.length / tournament.value?.data.length : 0;
</script>
<template>
  <h1 class="text-center text-4xl font-bold">
    {{ tournament?.data[0].name }}
  </h1> 
  <div v-if="numberOfMatches === 0" class="flex justify-center items-center h-[250px]">
    <p class="text-3xl font-bold text-center md:text-left">Ještě nebyly vyhodnoceny žádné zápasy</p>
  </div>
  <div v-else class="flex justify-center mt-5">
    <div class="flex flex-col border border-slate-50 border-r border-r-transparent">
      <div class="border-b border-slate-50 flex flex-col-reverse lg:flex-row items-center lg:items-start p-0 lg:p-3 lg:gap-2 justify-center">
        <span class="flex justify-center w-full p-2 lg:p-0"><Users /></span>
        <span class="hidden lg:inline">/</span>
        <span class="flex justify-center w-full p-2 lg:p-0 border-b border-b-slate-50 lg:border-none"><Swords /></span>
      </div>
      <div
        v-for="{ username } in tournament?.data"
        :key="username"
        class="px-3 py-2 text-xl [&:not(:last-child)]:border-b border-slate-50"
      >
        {{ username }}
      </div>
    </div>
    <div
      v-if="tournament!.userMatches.length > 0"
      class="flex border border-slate-50 overflow-x-auto custom-scrollbar"
    >
      <div
        v-for="col, row in Array.from({ length: numberOfMatches }, (_, index) => index)"
        :key="`${col}-${row}`"
        class="[&:not(:last-child)]:border-r border-r-slate-50"
      >
        <div class="border-b border-b-slate-50 flex flex-col lg:flex-row p-0 lg:p-3 gap-0 lg:gap-2">
          <span class="p-2 lg:p-0 border-b border-b-slate-50 lg:border-none">
            {{ tournament!.userMatches[row + (row * numberOfMatches)].homeTeamName }}
          </span> 
          <span class="hidden lg:inline-block">-</span> 
          <span class="p-2 lg:p-0">
            {{ tournament!.userMatches[row + (row * numberOfMatches)].awayTeamName }}
          </span>
        </div>
          <div 
            v-for="userMatch in tournament!.userMatches.slice(col * tournament!.data.length, col * tournament!.data.length + tournament!.data.length)"
            class="[&:not(:last-child)]:border-b border-slate-50 flex justify-center text-xl gap-1 py-2"
          >
            <span>{{ userMatch.homeScore }}</span> :
            <span>{{ userMatch.awayScore }}</span>
          </div>
      </div>
    </div>
  </div>
</template>