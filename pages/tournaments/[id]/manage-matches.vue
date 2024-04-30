<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';

const { toast } = useToast();
const { $client } = useNuxtApp();

const route = useRoute();

const tournamentId = +route.params.id;

const { data: matches, refresh } = await $client.tournament.getMatches.useQuery({ tournamentId });
const { data: teams } = await $client.tournament.getTeams.useQuery({ tournamentId });
const { data: groups } = await $client.tournament.getGroups.useQuery({ tournamentId });

const { handleSubmit, resetForm, values } = useForm({
	validationSchema: toTypedSchema(
		z.object({
			date: z.date(),
			group: z.string(),
		}),
	),
	initialValues: {
		group: groups.value![0].name,
	},
});

const { mutate: createMatch, status: createMatchStatus } = $client.match.create.useMutation();

if (createMatchStatus.value === 'success') {
	toast({
		title: 'Vytvořeno',
		description: `Zápas byl úspěšně vytvořen`,
	});
	refresh();
}

if (createMatchStatus.value === 'error') {
	toast({
		title: 'Chyba',
		description: `Nepodařilo se vytvořit záps`,
	});
}
</script>
<template>
  <form
    class="w-full max-w-xl mx-auto flex flex-col gap-4"
    @submit="handleSubmit"
  >
    <div class="flex flex-col gap-2">
      <FormField v-slot="{ componentField }" name="date">
        <FormItem>
          <FormLabel>Datum a čas</FormLabel>
          <FormControl>
            <Input type="datetime-local" v-bind="componentField" />
          </FormControl>
        </FormItem>
      </FormField>
    </div>
    <Button type="submit" class="w-full text-xl">
      Vytvořit zápas
    </Button>
  </form>
  <Table v-if="!!matches?.length" class="mt-5 max-w-5xl mx-auto">
    <TableHeader>
      <TableRow>
        <TableHead>Datum a čas</TableHead>
        <TableHead>Skupina</TableHead>
        <TableHead>Domácí</TableHead>
        <TableHead>Hosté</TableHead>
        <TableHead>Skóre</TableHead>
        <TableHead>Akce</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="match in matches" :key="match.id">
        <TableCell>{{ match.date }}</TableCell>
        <TableCell>{{ match.group }}</TableCell>
        <TableCell>{{ match.homeTeamName }}</TableCell>
        <TableCell>{{ match.awayTeamName }}</TableCell>
        <TableCell>{{ match.homeScore }}</TableCell>
        <TableCell>{{ match.awayScore }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <div v-else class="flex justify-center items-center h-[250px]">
    <p class="text-3xl font-bold">Žádné zápasy</p>
  </div>
</template>