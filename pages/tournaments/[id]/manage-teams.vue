<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const route = useRoute();

const tournamentId = +route.params.id;

const { toast } = useToast();
const { $client } = useNuxtApp();

const { data: overallTeams } = await $client.tournament.getOverallTeams.useQuery({ tournamentId });
const { data: teams } = await $client.tournament.getTeams.useQuery({ tournamentId });
const { data: tableData } = await $client.tournament.getPlayerTeams.useQuery({ tournamentId });

const { mutate: updateOverallTeams } = $client.tournament.updateOverallTeams.useMutation();

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
		winnerId: overallTeams?.value?.winnerId?.toString() || '',
		finalistId: overallTeams?.value?.finalistId?.toString() || '',
		semifinalistFirstId: overallTeams?.value?.semifinalistFirstId?.toString() || '',
		semifinalistSecondId: overallTeams?.value?.semifinalistSecondId?.toString() || '',
	},
});

const onSubmit = handleSubmit(async (values) => {
	await updateOverallTeams({
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
    >
      Uložit týmy
    </Button>
  </form>
  <Table class="mt-4">
    <TableHeader>
      <TableRow class="[&>*]:text-nowrap grid grid-cols-5">
        <TableHead>Jméno</TableHead>
        <TableHead>Vítěz</TableHead>
        <TableHead>Finalista</TableHead>
        <TableHead>Semifinalista 1</TableHead>
        <TableHead>Semifinalista 2</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="player in tableData"
        :key="player.username"
        :class="cn('[&>*]:text-nowrap [&>*]:py-2 grid grid-cols-5')"
      >
        <TableCell>{{ player.username }}</TableCell>
        <TableCell>{{ player.winner }}</TableCell>
        <TableCell>{{ player.finalist }}</TableCell>
        <TableCell>{{ player.semifinalistFirst }}</TableCell>
        <TableCell>{{ player.semifinalistSecond }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>