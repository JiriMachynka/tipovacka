<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';

const emit = defineEmits(['refresh']);
const props = defineProps<{ tournamentId: number }>();

const { toast } = useToast();
const { $client } = useNuxtApp();

const { data: teams } = await $client.tournament.getTeams.useQuery({ tournamentId: props.tournamentId });
const { data: groups } = await $client.tournament.getGroups.useQuery({ tournamentId: props.tournamentId });

const { mutate: createMatch, status: createMatchStatus } = $client.match.create.useMutation();

const { handleSubmit, values } = useForm({
	// TODO: Validation schema is same as with edit match dialog
	validationSchema: toTypedSchema(
		z.object({
			date: z.string(),
			group: z.string(),
			homeTeamId: z.string(),
			awayTeamId: z.string(),
		}),
	),
	initialValues: {
		group: groups!.value[0].name,
	},
});

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
		await emit('refresh');
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
</template>