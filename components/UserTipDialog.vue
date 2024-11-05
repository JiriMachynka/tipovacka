<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

interface UserTipDialogProps {
	matchId: number;
	homeTeamName: string;
	homeScore: number;
	awayTeamName: string;
	awayScore: number;
}

const emit = defineEmits(['changeMatchScore']);

const props = defineProps<UserTipDialogProps>();

const route = useRoute();

const tournamentId = +route.params.id;

const { toast } = useToast();
const { $client } = useNuxtApp();

const { mutate: updateTip } = $client.tournament.updateUserMatchTip.useMutation();

const { handleSubmit, errors, resetForm } = useForm({
	validationSchema: toTypedSchema(
		z.object({
			homeScore: z.number({ message: 'Vyžadováno' }),
			awayScore: z.number({ message: 'Vyžadováno' }),
		}),
	),
	initialValues: {
		homeScore: props.homeScore,
		awayScore: props.awayScore,
	},
	keepValuesOnUnmount: true,
});

const onSubmit = handleSubmit(async (values) => {
	try {
		const updatedMatch = await updateTip({
			tournamentId,
			matchId: props.matchId,
			homeScore: values.homeScore,
			awayScore: values.awayScore,
		});
		toast({
			title: 'Úspěšně upraven',
			description: 'Výsledný stav byl úspěšně upraven',
		});
		emit('changeMatchScore', updatedMatch?.homeScore, updatedMatch?.awayScore);
	} catch (e) {
		toast({
			title: 'Chyba',
			description: 'Nepodařilo se uložit',
			variant: 'destructive',
		});
	}
});
</script>
<template>
  <AlertDialog>
    <AlertDialogTrigger :class="cn(buttonVariants({ variant: 'ghost' }), 'px-2')">
      <IconFlag />
    </AlertDialogTrigger>
    <AlertDialogContent>
      <form @submit="onSubmit">
        <AlertDialogHeader>
          <AlertDialogTitle class="text-2xl text-center">
            Úprava tipu
          </AlertDialogTitle>
          <AlertDialogDescription
            class="grid grid-cols-[1fr_12px_1fr] items-center w-full"
            as="div"
          >
            <FormField v-slot="{ componentField }" name="homeScore">
              <FormItem class="grid grid-cols-[auto_70px] justify-between items-center space-y-0">
                <FormLabel>{{ props.homeTeamName }}</FormLabel>
                  <FormControl>
                    <Input :class="cn(errors.homeScore && 'row-span-2')" type="number" v-bind="componentField" min="0" />
                  </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <span class="text-center inline-flex mx-1 font-bold">:</span>
            <FormField v-slot="{ componentField }" name="awayScore">
              <FormItem class="grid grid-cols-[70px_auto] justify-between items-center space-y-0">
                <FormControl>
                  <Input :class="cn(errors.awayScore && 'row-span-2')" type="number" v-bind="componentField" min="0" />
                </FormControl>
                <FormLabel>{{ props.awayTeamName }}</FormLabel>
                <FormMessage />
              </FormItem>
            </FormField>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter class="mt-2">
          <AlertDialogCancel @click="resetForm()">
            Zrušit
          </AlertDialogCancel>
          <AlertDialogAction type="submit">
            Uložit tip
          </AlertDialogAction>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  </AlertDialog>
</template>