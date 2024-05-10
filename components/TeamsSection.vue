<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const route = useRoute();

const tournamentId = +route.params.id;

const { toast } = useToast();
const { $client } = useNuxtApp();

const { data: teams } = await $client.tournament.getTeams.useQuery({ tournamentId });
const { data: overallTips } = await $client.tournament.getPlayerOverallTips.useQuery({ tournamentId });

const { mutate: updateOverallTip } = $client.tournament.updateOverallTip.useMutation();

const { handleSubmit } = useForm({
	validationSchema: toTypedSchema(
		z.object({
			winnerId: z.string({ required_error: 'Vyberte tým' }),
			finalistId: z.string({ required_error: 'Vyberte tým' }),
			semifinalistFirstId: z.string({ required_error: 'Vyberte tým' }),
			semifinalistSecondId: z.string({ required_error: 'Vyberte tým' }),
		}),
	),
	initialValues: {
		winnerId: overallTips.value?.winnerId?.toString() || '',
		finalistId: overallTips.value?.finalistId?.toString() || '',
		semifinalistFirstId: overallTips.value?.semifinalistFirstId?.toString() || '',
		semifinalistSecondId: overallTips.value?.semifinalistSecondId?.toString() || '',
	},
});

const onSubmit = handleSubmit(async (values) => {
	await updateOverallTip({
		tournamentId,
		winnerId: +values.winnerId,
		finalistId: +values.finalistId,
		semifinalistFirstId: +values.semifinalistFirstId,
		semifinalistSecondId: +values.semifinalistSecondId,
	});
	toast({
		title: 'Týmy byly uloženy',
		description: 'Týmy byly úspěšně uloženy',
	});
});

const sections = [
	{
		title: 'Výherce',
		name: 'winnerId',
	},
	{
		title: 'Finalista',
		name: 'finalistId',
	},
	{
		title: 'Semifinalista 1',
		name: 'semifinalistFirstId',
	},
	{
		title: 'Semifinalista 2',
		name: 'semifinalistSecondId',
	},
];
</script>
<template>
  <form
    class="max-w-3xl w-full mx-auto grid min-[500px]:grid-cols-2 lg:grid-cols-4 gap-2"
    @submit="onSubmit"
  >
    <FormField
      v-for="section in sections"
      :key="section.name"
      v-slot="{ componentField }"
      :name="section.name"
    >
      <FormItem>
        <FormLabel>{{ section.title }}</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Vyberte tým" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="team in teams"
                :key="team.id"
                :value="team.id.toString()"
              >
                {{ team.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button
      class="w-full col-span-1 min-[500px]:col-span-2 lg:col-span-4 text-xl font-bold disabled:opacity-100"
      type="submit"
      :disabled="overallTips?.lockScorers"
    >
      {{ overallTips?.lockScorers ? 'Týmy jsou uzamčeny' : 'Uložit týmy' }}
    </Button>
  </form>
</template>