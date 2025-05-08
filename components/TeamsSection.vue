<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const route = useRoute();

const tournamentId = +route.params.id;

const { $client } = useNuxtApp();

const { toast } = useToast();

const { data: teams } = await $client.tournament.getTeams.useQuery({ tournamentId });
const { data: overallTips } = await $client.tournament.getPlayerOverallTips.useQuery({ tournamentId });

const { mutate: updateOverallTip } = $client.tournament.updateOverallTip.useMutation();

const { handleSubmit } = useForm({
	validationSchema: toTypedSchema(
		z.object({
			winnerId: z.string({ required_error: 'Vyberte tým' }).nullable(),
			finalistId: z.string({ required_error: 'Vyberte tým' }).nullable(),
			semifinalistFirstId: z.string({ required_error: 'Vyberte tým' }).nullable(),
			semifinalistSecondId: z.string({ required_error: 'Vyberte tým' }).nullable(),
		}),
	),
	initialValues: {
		winnerId: overallTips.value?.winnerId?.toString() || null,
		finalistId: overallTips.value?.finalistId?.toString() || null,
		semifinalistFirstId: overallTips.value?.semifinalistFirstId?.toString() || null,
		semifinalistSecondId: overallTips.value?.semifinalistSecondId?.toString() || null,
	},
});

const onSubmit = handleSubmit(async (values) => {
	const { winnerId, finalistId, semifinalistFirstId, semifinalistSecondId } = values;

	await updateOverallTip({
		tournamentId,
		winnerId: Number(winnerId) || null,
		finalistId: Number(finalistId) || null,
		semifinalistFirstId: Number(semifinalistFirstId) || null,
		semifinalistSecondId: Number(semifinalistSecondId) || null,
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

const overallTipsTeams = [
	{
		title: 'Výherce',
		name: teams.value?.find((team) => team.id === overallTips.value?.winnerId)?.name || '',
	},
	{
		title: 'Finalista',
		name: teams.value?.find((team) => team.id === overallTips.value?.finalistId)?.name || '',
	},
	{
		title: 'Semifinalista 1',
		name: teams.value?.find((team) => team.id === overallTips.value?.semifinalistFirstId)?.name || '',
	},
	{
		title: 'Semifinalista 2',
		name: teams.value?.find((team) => team.id === overallTips.value?.semifinalistSecondId)?.name || '',
	},
];
</script>
<template>
  <form
    v-if="!overallTips?.lockScorers"
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
        <Select
          v-bind="componentField"
          class="disabled:opacity-100"
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Vyberte tým" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="team in teams?.sort((a, b) => a.name.localeCompare(b.name))"
                :key="team.id"
                :value="team.id.toString()"
              >
                <span class="inline-flex items-center gap-4">
                  <TeamNameFlag :teamName="team.name" />
                </span>
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
    >
      Uložit týmy
    </Button>
  </form>
  <div v-else class="max-w-3xl w-full mx-auto grid min-[500px]:grid-cols-2 lg:grid-cols-4 gap-2">
    <div
      v-for="{ title, name } in overallTipsTeams"
      :key="name"
      class="flex flex-col justify-center gap-2"
    >
      <p class="text-lg font-bold leading-none">
        {{ title }}
      </p>
      <div class="inline-flex items-center gap-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background select-none cursor-not-allowed">
        <TeamNameFlag :teamName="name" />
      </div>
    </div>
    <Card class="border-red-500 min-[500px]:col-span-2 lg:col-span-4">
      <CardContent class="flex items-center gap-4 p-3">
        <IconAlertTriangle color="red" class="size-8" />
        <p class="text-lg font-bold">Střelci a týmy jsou uzamčeny</p> 
      </CardContent>
    </Card>
  </div>
</template>