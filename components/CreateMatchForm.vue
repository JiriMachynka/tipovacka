<script lang="ts" setup>
import type { Team, Group } from '~/types';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, configure } from 'vee-validate';
import { z } from 'zod';

interface CreateMatchFormProps {
	tournamentId: number;
	teams: Team[];
	groups: Group[];
}

const emit = defineEmits(['refresh']);
const props = defineProps<CreateMatchFormProps>();

const { $client } = useNuxtApp();

const { toast } = useToast();

const { mutate: createMatch } = $client.match.create.useMutation();

configure({ validateOnModelUpdate: false });
const { handleSubmit, values, setFieldValue, setErrors } = useForm({
	validationSchema: toTypedSchema(
		z.object({
			date: z.string(),
			group: z.string(),
			homeTeamId: z.string(),
			awayTeamId: z.string(),
		}),
	),
	initialValues: {
		group: props.groups[0].name,
	},
});

const onSubmit = handleSubmit(async (values) => {
	try {
		const { date, group, homeTeamId, awayTeamId } = values;

		await createMatch({
			tournamentId: props.tournamentId,
			date,
			group,
			homeTeamId: +homeTeamId,
			awayTeamId: +awayTeamId,
		});

		toast({
			title: 'Vytvořeno',
			description: 'Zápas byl úspěšně vytvořen',
		});
		await emit('refresh');
	} catch (e) {
		toast({
			title: 'Chyba',
			description: 'Nepodařilo se vytvořit záps',
		});
	}
});

watch(
	() => values.group,
	() => {
		setFieldValue('homeTeamId', undefined, false);
		setFieldValue('awayTeamId', undefined, false);
	},
);

watch(
	() => values.homeTeamId,
	(homeTeamIdValue) => {
		if (homeTeamIdValue && values.awayTeamId && +homeTeamIdValue === +values.awayTeamId) {
			setFieldValue('awayTeamId', undefined, false);
		}
	},
);

watch(values, () => {
  setErrors({
    date: undefined,
    group: undefined,
    homeTeamId: undefined,
    awayTeamId: undefined,
  });
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
                v-for="group in props.groups"
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
                <SelectValue placeholder="Vyberte tým" :class="cn('space-x-4')" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="team in (
                    values.group === 'Playoff' ?
                    props.teams.sort((a, b) => a.name.localeCompare(b.name)) :
                    props.teams.filter((team) => team.groupName === values.group).sort((a, b) => a.name.localeCompare(b.name))
                  )"
                  :key="team.id"
                  :value="team.id.toString()"
                  :class="cn('[&>:nth-child(2)]:space-x-4')"
                >
                  <TeamNameFlag :teamName="team.name" />
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
                <SelectValue placeholder="Vyberte tým" :class="cn('space-x-4')" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="team in (
                    values.group === 'Playoff' ?
                    props.teams.sort((a, b) => a.name.localeCompare(b.name)) :
                    props.teams.filter((team) => team.groupName === values.group && team.id !== +(values.homeTeamId ?? 0)).sort((a, b) => a.name.localeCompare(b.name))
                  )"
                  :key="team.id"
                  :value="team.id.toString()"
                  :class="cn('[&>:nth-child(2)]:space-x-4')"
                >
                  <TeamNameFlag :teamName="team.name" />
                  <!-- {{ team.name }}s -->
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