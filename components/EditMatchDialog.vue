<script lang="ts" setup>
import type { Team, Group } from '@/types';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';

interface EditMatchDialogProps {
	teams: Team[];
	groups: Group[];
	matchId: number;
	date: string;
	group: string;
	homeTeamId: string;
	awayTeamId: string;
}

const emit = defineEmits(['refresh']);

const props = defineProps<EditMatchDialogProps>();

const { toast } = useToast();
const { $client, $dayjs } = useNuxtApp();

const { mutate: editMatch } = $client.match.edit.useMutation();

const { handleSubmit, values, resetForm } = useForm({
	validationSchema: toTypedSchema(
		z.object({
			date: z.string(),
			group: z.string(),
			homeTeamId: z.string(),
			awayTeamId: z.string(),
		}),
	),
	initialValues: {
		date: $dayjs(props.date).utc().format('YYYY-MM-DDTHH:mm:ss'),
		group: props.group,
		homeTeamId: props.homeTeamId,
		awayTeamId: props.awayTeamId,
	},
	keepValuesOnUnmount: true,
});

// TODO: Fix props not changing after edited match
const onSubmit = handleSubmit(async (values) => {
	await editMatch({
		matchId: props.matchId,
		date: values.date,
		group: values.group,
		homeTeamId: +values.homeTeamId,
		awayTeamId: +values.awayTeamId,
	});

	emit('refresh');

	toast({
		title: 'Úprava zápasu',
		description: 'Zápas byl úspěšně upraven',
	});
});
</script>
<template>
  <AlertDialog>
    <AlertDialogTrigger :class="cn(buttonVariants({ variant: 'ghost' }), 'px-2')">
      <IconSquarePen />
    </AlertDialogTrigger>
    <AlertDialogContent>
      <form @submit="onSubmit">
        <AlertDialogHeader>
          <AlertDialogTitle class="text-2xl text-center">
            Upravit zápas
          </AlertDialogTitle>
          <AlertDialogDescription class="w-full max-w-xl mx-auto space-y-2">
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
                        <SelectValue placeholder="Vyberte tým" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          v-for="team in props.teams.filter((team) => values.group === 'Playoff' || team.groupName === values.group).sort((a, b) => a.name.localeCompare(b.name))"
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
                          v-for="team in props.teams.filter((team) => values.group === 'Playoff' || (team.groupName === values.group && team.id !== +values.homeTeamId)).sort((a, b) => a.name.localeCompare(b.name))"
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
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter class="mt-2">
          <AlertDialogCancel
            :class="cn(buttonVariants({ variant: 'destructive' }), 'font-bold')"
            @click="resetForm()"
          >
            Zrušit
          </AlertDialogCancel>
          <AlertDialogAction 
            type="submit"
            :class="cn('font-bold')"
          >
            Upravit
          </AlertDialogAction>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  </AlertDialog>
</template>