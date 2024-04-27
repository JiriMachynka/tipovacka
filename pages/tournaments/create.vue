<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';

const validationSchema = toTypedSchema(
	z.object({
		tournamentName: z.string({ required_error: 'Název je vyžadován' }).min(3, { message: 'Název je vyžadován' }).trim(),
		players: z.string().optional(),
		teams: z.string({ required_error: 'Týmy jsou vyžadovány' }),
	}),
);

const { $client } = useNuxtApp();

const { mutate: createTournament } = $client.tournament.create.useMutation();
const { data: user } = await $client.user.me.useQuery();

const { defineField, handleSubmit, isSubmitting } = useForm({
	validationSchema,
	initialValues: {
		tournamentName: '',
		players: '',
		teams: '',
	},
});

const [tournamentName, tournamentNameAttrs] = defineField('tournamentName');
const [players, playersAttrs] = defineField('players');
const [teams, teamsAttrs] = defineField('teams');

const onSubmit = handleSubmit(async (values) => {
	const { tournamentName, teams, players } = values;

	const allPlayers = players?.split('\n').filter((player) => player.trim() !== '') || [];
	const allTeams = teams.split('\r\n').map((team) =>
		team
			.split(',')
			.filter((team) => team.trim() !== '')
			.map((team) => team.trim()),
	);

	const tournamentId = createTournament({
		tournamentName,
		teams: allTeams,
		players: [user.value!.username, ...allPlayers],
	});

	navigateTo(`/tournaments/${tournamentId}`);
});
</script>
<template>
  <div class="flex flex-col h-dvh">
    <Button 
      class="w-fit mx-auto my-3"
      @click="navigateTo('/')" 
    > 
      Zpět na tipovačky
    </Button>
    <form class="flex flex-col gap-5 mx-3 lg:w-full lg:max-w-screen-lg lg:mx-auto" @submit="onSubmit">
      <div class="flex flex-col gap-3">
        <Label for="tournamentName">Název tipovačky</Label>
        <Input 
          id="tournamentName" 
          type="text"
          v-model="tournamentName"
          v-bind="tournamentNameAttrs"
          class="w-full"
          placeholder="Název tipovačky"
        />
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex gap-3">
          <Label for="players">Hráči</Label>
          <InfoTooltip>
            <p class="text-base">Hráči se zadávají ve formátu:</p>
            <p class="text-base">Každý hráč na novém řádku</p>
          </InfoTooltip>
        </div>
        <Textarea
          id="players"
          v-model="players"
          v-bind="playersAttrs"
          class="w-full h-52"
        />
      </div>
      <div class="flex flex-col w-full gap-3">
        <div class="flex gap-3">
          <Label for="teams">Týmy</Label>
          <InfoTooltip>
            <p class="text-base">Týmy se zadávají ve formátu:</p>
            <p class="text-base">Název týmu, Název týmu, Název týmu</p>
            <p class="text-base">Každý skupina na novém řádku</p>
          </InfoTooltip>
        </div>
        <Textarea
          id="teams"
          v-model="teams"
          v-bind="teamsAttrs"
          class="h-40"
        />
      </div>
      <Button
        class="text-xl py-3 lg:text-3xl"
        type="submit"
        :disabled="isSubmitting"
      >
        Vytvořit tipovačku
      </Button>
    </form>
  </div>
</template>