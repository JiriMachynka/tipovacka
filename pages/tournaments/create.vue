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

const { handleSubmit, isSubmitting } = useForm({
	validationSchema,
	initialValues: {
		tournamentName: '',
		players: '',
		teams: '',
	},
});

const onSubmit = handleSubmit(async (values) => {
	const { tournamentName, teams, players } = values;

	const allPlayers = players?.split('\n').filter((player) => player.trim() !== '') || [];
	const allTeams = teams.split('\n').map((team) =>
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
      @click="navigateTo('/tournaments')" 
    > 
      Zpět na tipovačky
    </Button>
    <form class="flex flex-col gap-5 mx-3 lg:w-full lg:max-w-screen-lg lg:mx-auto" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="tournamentName">
        <FormItem>
          <FormLabel>Název tipovačky</FormLabel>
          <FormControl>
            <Input
              type="text"
              v-bind="componentField"
              placeholder="Název tipovačky"
              class="w-full"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="players">
        <FormItem>
          <FormLabel class="inline-flex gap-2">
            Hráči
            <InfoTooltip class="*:text-base">
              <p>Hráči se zadávají ve formátu:</p>
              <p>Každý hráč na novém řádku</p>
            </InfoTooltip>
          </FormLabel>
          <FormControl>
            <Input
              type="text"
              v-bind="componentField"
              class="w-full h-52"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="teams">
        <FormItem>
          <FormLabel class="inline-flex gap-2">
            Týmy
            <InfoTooltip class="*:text-base">
              <p>Týmy se zadávají ve formátu:</p>
              <p>Název týmu, Název týmu, Název týmu</p>
              <p>Každý skupina na novém řádku</p>
            </InfoTooltip>
          </FormLabel>
          <FormControl>
            <Textarea
              v-bind="componentField"
              class="h-40"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
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