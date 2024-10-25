<script lang="ts" setup>
import { ExternalLink } from 'lucide-vue-next';

const { $client } = useNuxtApp();

const route = useRoute();

const tournamentId = +route.params.id;

const { data: tournament } = await $client.tournament.getData.useQuery({ tournamentId });

const numberOfPlayers = tournament.value?.data.numberOfPlayers ?? 0;
const numberOfMatches = tournament.value?.data.numberOfMatches ?? 0;
const slicedUsermatches = Array.from({ length: numberOfPlayers }, (_, row) =>
	tournament.value?.userMatches.slice(row * numberOfMatches, row * numberOfMatches + numberOfMatches),
);

const matches = Array.from({ length: numberOfMatches }, (_, index) => index).map((_, row) => ({
	label: `${capitalize(tournament.value?.userMatches[row].homeTeamName ?? '')} - ${capitalize(tournament.value?.userMatches[row].awayTeamName ?? '')}`,
	field: `${tournament.value?.userMatches[row].homeTeamName.toLowerCase().replace(' ', '-') ?? ''}-${tournament.value?.userMatches[row].awayTeamName.toLowerCase().replace(' ', '-') ?? ''}`,
}));

const downloadTournament = async () => {
	console.log('Aktuálně nefunguje');
	// const matches = Array.from({ length: numberOfMatches }, (_, index) => index).map((_, row) => ({
	// 	match: `${capitalize(tournament.value?.userMatches[row].homeTeamName ?? '')} - ${capitalize(tournament.value?.userMatches[row].awayTeamName ?? '')}`,
	// }));

	const columns = [
		{ name: 'Hráč', label: 'hrac' },
		{ name: 'Střelec 1', label: 'strelec1' },
		{ name: 'Střelec 2', label: 'strelec2' },
		...matches.map(({ label, field }) => ({ label, field })),
	];

	const data = [
		...(tournament.value?.players.map(({ username, scorerFirstName, scorerSecondName }, row) => ({
			hrac: username,
			strelec1: scorerFirstName.trim(),
			strelec2: scorerSecondName.trim(),
			...(tournament.value?.userMatches?.slice(row * numberOfPlayers, row * numberOfPlayers + numberOfMatches)?.reduce((acc, um) => {
				acc[`${um.homeTeamName.toLowerCase().replace(' ', '-')}-${um.awayTeamName.toLowerCase().replace(' ', '-')}`] =
					`${um.homeScore}:${um.awayScore}`;
				return acc;
			}, {}) ?? {}),
		})) ?? []),
	];

	console.log({
		columns,
		data,
	});
	// const data = {
	// 	headers: ['Hráč', 'Střelec 1', 'Střelec 2', ...matches.map(({ match }) => match)],
	// 	data:
	// 		tournament.value?.players.map(({ username, scorerFirstName, scorerSecondName }, row) => [
	// 			username,
	// 			scorerFirstName.trim(),
	// 			scorerSecondName.trim(),
	// 			...(tournament.value?.userMatches
	// 				?.slice(row * numberOfPlayers, row * numberOfPlayers + numberOfMatches)
	// 				?.map((um) => `${um.homeScore}:${um.awayScore}`) ?? []),
	// 		]) ?? [],
	// };
	// await createSpreadsheet(data, { type: 'excel' }).download('Tipovacka_tabulka.xlsx');

	// const worksheet = utils.aoa_to_sheet(data);
	// const workbook = utils.book_new();
	// utils.book_append_sheet(workbook, worksheet, 'Sheet1');
	// write(workbook, { bookType: 'xlsx', type: 'array' });
	// const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
	// const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
	// saveAs(blob, 'Tipovacka_tabulka.xlsx');
};
</script>
<template>
  <div :class="cn('inline-flex justify-center items-center', tournament?.data.isAuthor && 'gap-6')"> 
    <h1 class="text-4xl font-bold">{{ tournament?.data.name }}</h1>
    <Button
      v-if="tournament?.data.isAuthor"
      variant="outline"
      :class="cn('p-2')"
      @click="downloadTournament"
    >
      <IconDownload class="size-6" />
    </Button>
  </div> 
  <div v-if="numberOfMatches === 0" class="flex justify-center items-center h-[250px]">
    <p class="text-3xl font-bold text-center md:text-left">Ještě nebyly vyhodnoceny žádné zápasy</p>
  </div>
  <div v-else class="flex justify-center mt-5">
    <div class="flex flex-col border border-primary">
      <div class="border-b border-primary flex flex-col-reverse lg:flex-row items-center lg:items-start p-0 lg:p-3 lg:gap-2 justify-center">
        <span class="flex justify-center w-full p-2 lg:p-0"><IconUsers /></span>
        <span class="hidden lg:inline">/</span>
        <span class="flex justify-center w-full p-2 lg:p-0 border-b border-b-primary lg:border-none"><IconSwords /></span>
      </div>
      <div
        v-for="{ id, username } in tournament?.players"
        :key="username"
        class="text-xl px-3 py-2 [&:not(:last-child)]:border-b border-b-primary text-nowrap"
      >
        <PlayerTipsDialog :username="username" :tournamentId="tournamentId" :playerId="id">
          {{ username }}
          <ExternalLink class="size-4" />
        </PlayerTipsDialog>
      </div>
    </div>
    <div class="flex border border-primary overflow-x-auto">
      <!-- <div class="flex">
        <div class="border border-primary">
          <span class="inline-flex w-full justify-center border-b border-b-primary py-[26px] lg:py-[11.5px] text-lg lg:text-base">
            Střelec 1
          </span>
          <div
            v-for="{ scorerFirstName } in tournament?.players"
            :key="scorerFirstName"
            class="[&:not(:last-child)]:border-b border-b-primary"
          >
            <div class="text-center text-xl px-4 py-2 text-nowrap">
              {{ scorerFirstName }}
            </div>
          </div>
        </div>
        <div class="border border-primary">
          <span class="inline-flex w-full justify-center border-b border-b-primary py-[26px] lg:py-[11.5px] text-lg lg:text-base">
            Střelec 2
          </span>
          <div
            v-for="{ scorerSecondName } in tournament?.players"
            :key="scorerSecondName"
            class="[&:not(:last-child)]:border-b border-b-primary"
          >
            <div class="[&:not(:last-child)]:border-b border-b-primary text-center text-xl px-4 py-2 text-nowrap">
              {{ scorerSecondName }}
            </div>
          </div>
        </div>
      </div> -->
      <div
        v-if="tournament!.userMatches.length > 0"
        v-for="col in Array.from({ length: numberOfMatches }, (_, index) => index)"
        :key="col"
        class="[&:not(:last-child)]:border-r border-r-primary [&:not(:last-child)]:border-b border-b-primary"
      >
        <div class="border-b border-primary flex flex-col lg:flex-row p-0 lg:p-3 gap-0 lg:gap-2">
          <span class="p-2 lg:p-0 border-b border-b-primary lg:border-none text-nowrap">
            {{ tournament!.userMatches[col].homeTeamName }}
          </span> 
          <span class="hidden lg:inline-block">-</span> 
          <span class="p-2 lg:p-0 text-nowrap">
            {{ tournament!.userMatches[col].awayTeamName }}
          </span>
        </div>
        <div
          v-for="row in Array.from({ length: numberOfPlayers }, (_, index) => index)" 
          class="border-b border-b-primary flex justify-center text-xl gap-1 py-2"
        >
          <span>{{ slicedUsermatches?.at(row)?.at(col)?.homeScore }}</span> :
          <span>{{ slicedUsermatches?.at(row)?.at(col)?.awayScore }}</span>
        </div>
      </div>
    </div>
  </div>
</template>