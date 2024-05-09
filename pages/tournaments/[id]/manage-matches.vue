<script lang="ts" setup>
const { $client } = useNuxtApp();

const route = useRoute();

const tournamentId = +route.params.id;

const { data: teams } = await $client.tournament.getTeams.useQuery({ tournamentId });
const { data: groups } = await $client.tournament.getGroups.useQuery({ tournamentId });
const { data: matches, refresh } = await $client.tournament.getMatches.useQuery({ tournamentId });
</script>
<template>
  <CreateMatchForm
    :tournamentId="tournamentId"
    :teams="teams"
    :groups="groups"
    @refresh="refresh"
  />
  <Table v-if="!!matches?.length" class="mt-5 max-w-5xl mx-auto">
    <TableHeader>
      <TableRow>
        <TableHead class="text-nowrap">Datum a čas</TableHead>
        <TableHead class="text-nowrap">Skupina</TableHead>
        <TableHead class="text-nowrap">Domácí</TableHead>
        <TableHead class="text-nowrap">Hosté</TableHead>
        <TableHead class="text-nowrap">Skóre</TableHead>
        <TableHead class="text-nowrap">Akce</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="match in matches" :key="match.id">
        <TableCell>
          <span v-if="!match.played">
            <span>{{ $dayjs(match.date).fromNow() }}</span>
            <Separator class="my-0.5" />
            <span>{{ $dayjs(match.date).format("DD.MM.YYYY HH:mm") }}</span>
          </span>
          <span v-else>Odehráno</span>
        </TableCell>
        <TableCell>{{ match.group }}</TableCell>
        <TableCell>{{ match.homeTeamName }}</TableCell>
        <TableCell>{{ match.awayTeamName }}</TableCell>
        <TableCell>{{ match.homeScore }}:{{ match.awayScore }}</TableCell>
        <TableCell class="space-x-2">
          <EditMatchDialog
            v-if="!match.locked"
            :matchId="match.id"
            :date="match.date"
            :teams="teams"
            :groups="groups"
            :group="match.group"
            :homeTeamId="match.homeTeamId.toString()"
            :awayTeamId="match.awayTeamId.toString()"
            @refresh="refresh"
          />
          <FinishMatchDialog
            v-if="match.locked"
            :matchId="match.id"
            :homeTeamName="match.homeTeamName"
            :homeScore="match.homeScore"
            :awayTeamName="match.awayTeamName"
            :awayScore="match.awayScore"
            @refresh="refresh"
          />
          <DeleteMatchDialog
            :matchId="match.id"
            :homeTeamName="match.homeTeamName"
            :awayTeamName="match.awayTeamName"
            @refresh="refresh"
          />
          <UpdateLockStatus
            :matchId="match.id"
            :locked="match.locked"
            @refresh="refresh"
          />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <div v-else class="flex justify-center items-center h-[250px]">
    <p class="text-3xl font-bold">Žádné zápasy</p>
  </div>
</template>