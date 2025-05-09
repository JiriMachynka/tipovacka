<script lang="ts" setup>
const route = useRoute();

const tournamentId = +route.params.id;

const { $client, $dayjs } = useNuxtApp();

const { data: userMatches } = await $client.tournament.getUserMatches.useQuery({ tournamentId });

const filterMatches = ref(false);
const matches = computed(() => userMatches.value?.filter((m) => !m.played) || []);

const changeMatchScore = (matchId: number, homeScore: number, awayScore: number) => {
	userMatches.value =
		userMatches.value?.map((um) => {
			if (um.id === matchId) {
				return { ...um, homeScore, awayScore };
			}
			return um;
		}) || [];
};
</script>
<template>
  <div v-if="userMatches?.length" class="flex items-center gap-5 my-5"> 
    <Switch @click="filterMatches = !filterMatches" :checked="filterMatches" />
    <p class="text-xl font-bold">
      Zobrazit všechny zápasy
    </p>
  </div>
  <Table v-if="userMatches?.length">
    <TableHeader>
      <TableRow>
        <TableHead>Start</TableHead>
        <TableHead>Skupina</TableHead>
        <TableHead>Domácí</TableHead>
        <TableHead>Skóre</TableHead>
        <TableHead>Hosté</TableHead>
        <TableHead>Akce</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="match in (filterMatches ? userMatches : matches)"
        :key="match.id"
        :class="cn({ 'bg-muted': match.homeScore > 0 || match.awayScore > 0 })"
      >
        <TableCell>{{ $dayjs(match.date).fromNow() }}</TableCell>
        <TableCell>{{ match.group }}</TableCell>
        <TableCell :class="cn('space-x-4 text-nowrap')">
          <TeamNameFlag :teamName="match.homeTeamName" />
        </TableCell>
        <TableCell>{{ match.homeScore }}:{{ match.awayScore }}</TableCell> 
        <TableCell :class="cn('space-x-4 text-nowrap')">
          <TeamNameFlag :teamName="match.awayTeamName" />
        </TableCell>
        <TableCell>
          <span v-if="match.locked && !match.played" class="text-lg font-bold">
            Čeká se na<br />vyhodnocení zápasu
          </span>
          <span v-else-if="match.locked && match.played" class="text-lg font-bold">
            Zápas vyhodnocen ({{ match.points }}b)
          </span>
          <UserTipDialog
            v-else
            :matchId="match.id"
            :homeTeamName="match.homeTeamName"
            :homeScore="match.homeScore"
            :awayTeamName="match.awayTeamName"
            :awayScore="match.awayScore"
            @changeMatchScore="(homeScore, awayScore) => changeMatchScore(match.id, homeScore, awayScore)"
          />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <div v-else class="flex justify-center items-center h-[250px]">
    <p class="text-3xl font-bold">Žádné zápasy</p>
  </div>
</template>