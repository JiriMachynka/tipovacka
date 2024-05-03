<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';

const { toast } = useToast();
const { $client } = useNuxtApp();

const route = useRoute();

const tournamentId = +route.params.id;

// TODO: Validation schema is same as with edit match dialog
const createMatchSchema = toTypedSchema(
	z.object({
		date: z.string(),
		group: z.string(),
		homeTeamId: z.string(),
		awayTeamId: z.string(),
	}),
);

const { data: matches, refresh } = await $client.tournament.getMatches.useQuery({ tournamentId });
const { data: teams } = await $client.tournament.getTeams.useQuery({ tournamentId });
const { data: groups } = await $client.tournament.getGroups.useQuery({ tournamentId });

const { handleSubmit, values } = useForm({
	validationSchema: createMatchSchema,
	initialValues: {
		group: groups!.value[0].name,
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

// TODO: Reset teams when group changes
// TODO: Reset away teams when homeTeamId changes
const onSubmit = handleSubmit(async (values) => {
	try {
		const { date, group, homeTeamId, awayTeamId } = values;

		await createMatch({
			tournamentId,
			date,
			group,
			homeTeamId: +homeTeamId,
			awayTeamId: +awayTeamId,
		});

		toast({
			title: 'Vytvořeno',
			description: `Zápas byl úspěšně vytvořen`,
		});
		refresh();
	} catch (e) {
		toast({
			title: 'Chyba',
			description: `Nepodařilo se vytvořit záps`,
		});
	}
});
</script>
<template>
  <form
    class="w-full max-w-xl mx-auto flex flex-col gap-4"
    @submit="onSubmit"
  >
    <FormField v-slot="{ componentField }" name="date">
      <FormItem>
        <FormLabel>Datum a čas</FormLabel>
        <FormControl>
          <Input type="datetime-local" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="group">
      <FormItem>
        <FormLabel>Skupina</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Vyberte skupinu" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="group in groups"
                :key="group.name"
                :value="group.name"
              >
                {{ group.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>
    <div class="grid grid-cols-2 gap-4">
      <FormField v-slot="{ componentField }" name="homeTeamId">
        <FormItem>
          <FormLabel>Tým domácí</FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte tým" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="team in teams.filter((team) => team.groupName === values.group)"
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
      <FormField v-slot="{ componentField }" name="awayTeamId">
        <FormItem>
          <FormLabel>Tým hosté</FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte tým" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="team in teams.filter((team) => team.groupName === values.group && team.id !== +values.homeTeamId)"
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