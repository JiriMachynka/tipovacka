<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

import { Flag } from 'lucide-vue-next';

interface UserTipDialogProps {
	matchId: number;
	homeTeamName: string;
	homeScore: number;
	awayTeamName: string;
	awayScore: number;
}

const emit = defineEmits(['refresh']);

const props = defineProps<UserTipDialogProps>();

const route = useRoute();

const tournamentId = +route.params.id;

const { $client } = useNuxtApp();
const { toast } = useToast();

const { mutate: updateTip } = $client.tournament.updateUserMatchTip.useMutation();

const { handleSubmit } = useForm({
	validationSchema: toTypedSchema(
		z.object({
			homeScore: z.number(),
			awayScore: z.number(),
		}),
	),
	initialValues: {
		homeScore: props.homeScore,
		awayScore: props.awayScore,
	},
});

const onSubmit = handleSubmit(async (values) => {
	await updateTip({
    tournamentId,
		matchId: props.matchId,
		homeScore: values.homeScore,
		awayScore: values.awayScore,
	});
	await emit('refresh');
});
</script>
<template>
  <AlertDialog>
    <AlertDialogTrigger :class="cn(buttonVariants({ variant: 'ghost' }), 'px-2')">
      <Flag />
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
                    <Input type="number" v-bind="componentField" min="0" />
                  </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <span class="text-center inline-flex mx-1 font-bold">:</span>
            <FormField v-slot="{ componentField }" name="awayScore">
              <FormItem class="grid grid-cols-[70px_auto] justify-between items-center space-y-0">
                <FormControl>
                  <Input type="number" v-bind="componentField" min="0" />
                </FormControl>
                <FormLabel>{{ props.awayTeamName }}</FormLabel>
                <FormMessage />
              </FormItem>
            </FormField>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter class="mt-2">
          <AlertDialogCancel>
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