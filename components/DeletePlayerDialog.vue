<script lang="ts" setup>
import { Trash } from 'lucide-vue-next';

interface DeletePlayerDialogProps {
	username: string;
	playerId: number;
}

const emit = defineEmits(['refresh']);

const props = defineProps<DeletePlayerDialogProps>();

const route = useRoute();

const tournamentId = +route.params.id;

const { $client } = useNuxtApp();

const { mutate: deletePlayer } = $client.player.delete.useMutation();
const { refresh: refreshUsers } = await $client.user.getAll.useQuery({ tournamentId });

const handleDelete = async () => {
	await deletePlayer({
		playerId: props.playerId,
	});
	emit('refresh');
	refreshUsers();
};
</script>
<template>
  <AlertDialog>
    <AlertDialogTrigger :class="cn(buttonVariants({ variant: 'ghost' }),
      'px-2 hover:bg-destructive transition-colors duration-300 hover:cursor-pointer'
      )"
    >
      <Trash />
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Opravdu chcete smazat hráče {{ props.username }}?
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>
          Zrušit
        </AlertDialogCancel>
        <AlertDialogAction 
          :class="cn(buttonVariants({ variant: 'destructive' }))"
          @click="handleDelete"
        >
          Odstranit
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>