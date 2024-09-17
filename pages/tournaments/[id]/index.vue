<script lang="ts" setup>
import xlsx, { type IJsonSheet } from 'json-as-xlsx';

const { $client } = useNuxtApp();

const route = useRoute();

const tournamentId = +route.params.id;

const { data: tournament } = await $client.tournament.getData.useQuery({ tournamentId });

const numberOfPlayers = tournament.value?.data.numberOfPlayers as number;
const numberOfMatches = tournament.value?.userMatches ? tournament.value?.userMatches.length / numberOfPlayers : 0;

const downloadTournament = () => {
	const columnsData = [
		{ label: 'Hráč', value: '0player' },
		{ label: 'Střelec 1', value: '1scorerFirst' },
		{ label: 'Střelec 2', value: '2scorerSecond' },
		...Array.from({ length: numberOfMatches }, (_, index) => index).map((_, row) => ({
			label: `${tournament.value?.userMatches[row * numberOfPlayers].homeTeamName} - ${tournament.value?.userMatches[row * numberOfPlayers].awayTeamName}`,
			value: `${3 + row}${tournament.value?.userMatches[row * numberOfPlayers].homeTeamName.toLowerCase()}${tournament.value?.userMatches[row * numberOfPlayers].awayTeamName.toLowerCase()}`,
		})),
	];

	const contentData = tournament.value?.userMatches
		.flatMap((_, row) => {
			return tournament.value?.players.map(({ username, scorerFirstName, scorerSecondName }) => ({
				'0player': username,
				'1scorerFirst': scorerFirstName,
				'2scorerSecond': scorerSecondName,
				[`${3 + row}${tournament.value?.userMatches[row * numberOfPlayers].homeTeamName.toLowerCase()}${tournament.value?.userMatches[row * numberOfPlayers].awayTeamName.toLowerCase()}`]: `${tournament.value?.userMatches[row * numberOfPlayers].homeScore} - ${tournament.value?.userMatches[row * numberOfPlayers].awayScore}`,
			}));
		})
		.reduce((acc, curr) => {
			Object.keys(curr).forEach((key) => {
				if (key !== 'player' || key !== 'scorerFirst' || key !== 'scorerSecond') {
					if (!acc[key]) {
						acc[key] = curr[key];
					}
				} else {
					acc[curr.Hrac] = { ...acc[curr.Hrac], [key]: curr[key] };
				}
			});
			return acc;
		}, {});

	const data: IJsonSheet[] = [
		{
			sheet: 'Tipovačka',
			columns: columnsData,
			content: [contentData],
		},
	];

	xlsx(data, { fileName: 'Tipovačka' });
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
        v-for="{ username } in tournament?.players"
        :key="username"
        class="inline-flex text-xl px-3 py-2 [&:not(:last-child)]:border-b border-b-primary"
      >
        {{ username }}
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
        v-for="col, row in Array.from({ length: numberOfMatches }, (_, index) => index)"
        :key="row"
        class="[&:not(:last-child)]:border-r border-r-primary [&:not(:last-child)]:border-b border-b-primary"
      >
        <div class="border-b border-primary flex flex-col lg:flex-row p-0 lg:p-3 gap-0 lg:gap-2">
          <span class="p-2 lg:p-0 border-b border-b-primary lg:border-none text-nowrap">
            {{ tournament!.userMatches[row * numberOfPlayers].homeTeamName }}
          </span> 
          <span class="hidden lg:inline-block">-</span> 
          <span class="p-2 lg:p-0 text-nowrap">
            {{ tournament!.userMatches[row * numberOfPlayers].awayTeamName }}
          </span>
        </div>
        <div
          v-for="userMatch in tournament!.userMatches.slice(col * numberOfPlayers, col * numberOfPlayers + numberOfPlayers)" 
          class="[&:not(:last-child)]:border-b border-b-primary flex justify-center text-xl gap-1 py-2"
        >
          <span>{{ userMatch.homeScore }}</span> :
          <span>{{ userMatch.awayScore }}</span>
        </div>
      </div>
    </div>
  </div>
</template>