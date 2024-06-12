<script lang="ts" setup>
import { Trash } from 'lucide-vue-next';

const emits = defineEmits(['refresh']);

defineProps<{
	matchId: number;
	homeTeamName: string;
	awayTeamName: string;
}>();

const { $client } = useNuxtApp();

const { toast } = useToast();

const { mutate: deleteMatch } = $client.match.delete.useMutation();

const handleDelete = async (matchId: number) => {
	await deleteMatch({ matchId });
	emits('refresh');

	toast({
		title: 'Zápas byl úspěšně smazán',
		description: 'Zápas byl úspěšně smazán',
	});
};
</script>
<template>
  <AlertDialog>
    <AlertDialogTrigger
      :class="cn(buttonVariants({ variant: 'ghost' }),
        'px-2 hover:bg-destructive transition-colors duration-300 hover:cursor-pointer'
      )"
    >
      <Trash />
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Opravdu chcete smazat zápas {{ homeTeamName }} vs. {{ awayTeamName }}?   
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel class="font-bold">
          Zrušit
        </AlertDialogCancel>
        <AlertDialogAction
          :class="cn(buttonVariants({ variant: 'destructive' }), 'font-bold')"
          @click="handleDelete(matchId)"
        >
          Smazat
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>