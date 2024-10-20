<script lang="ts" setup>
const { $client } = useNuxtApp();

const route = useRoute();

const tournamentId = +route.params.id;

const user = await useSupabaseUser();
const { data: leaderboard } = await $client.tournament.getPoints.useQuery({ tournamentId });
</script>
<template>
  <Table v-if="!!leaderboard?.length" class="max-w-[600px] mx-auto">
    <TableHeader>
      <TableRow class="grid grid-cols-[100px_1fr_100px]">
        <TableHead>Pořadí</TableHead>
        <TableHead>Hráč</TableHead>
        <TableHead>Body</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="(row, i) in leaderboard"
        :key="row.username"
        class="grid grid-cols-[100px_1fr_100px]"
        :class="row.currentPlayer && 'bg-gray-600'"
      >
        <TableCell>{{ i + 1 }}</TableCell>
        <TableCell>{{ row.username }}</TableCell>
        <TableCell>{{ row.points }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <div v-else class="flex justify-center items-center h-[250px]">
    <p class="text-3xl font-bold text-center md:text-left">Ještě nebyly vyhodnoceny žádné zápasy</p>
  </div>
</template>