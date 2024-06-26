<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';

interface FinishMatchDialogProps {
	matchId: number;
	homeTeamName: string;
	homeScore: number;
	awayTeamName: string;
	awayScore: number;
}

const emit = defineEmits(['refresh']);

const props = defineProps<FinishMatchDialogProps>();

const { toast } = useToast();
const { $client } = useNuxtApp();

const { handleSubmit, resetForm } = useForm({
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
	keepValuesOnUnmount: true,
});

const { mutate: finishMatch } = $client.match.finish.useMutation();

const onSubmit = handleSubmit(async (values) => {
	await finishMatch({
		matchId: props.matchId,
		homeScore: values.homeScore,
		awayScore: values.awayScore,
	});
	emit('refresh');
	toast({
		title: 'Výsledný stav',
		description: 'Zápas byl úspěšně upraven',
	});
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
            Výsledný stav
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