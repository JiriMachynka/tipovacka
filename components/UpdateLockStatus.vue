<script lang="ts" setup>
interface UpdateMatchStatusProps {
	matchId: number;
	locked: boolean;
}

const emit = defineEmits(['refresh']);

defineProps<UpdateMatchStatusProps>();

const { toast } = useToast();
const { $client } = useNuxtApp();

const { mutate: updateMatch } = $client.match.update.useMutation();

const handleUpdate = async (matchId: number, locked: boolean) => {
	await updateMatch({
		matchId,
		locked,
	});
	await emit('refresh');

	toast({
		title: locked ? 'Odemčeno' : 'Zamčeno',
		description: `Zápas byl úspěšně ${locked ? 'odemčen' : 'zamčen'}`,
	});
};
</script>
<template>
  <Button variant="ghost" class="px-2">
    <Lock v-if="!locked" class="cursor-pointer" @click="handleUpdate(matchId, true)" />
    <Unlock v-else class="cursor-pointer" @click="handleUpdate(matchId, false)" />
  </Button>
</template>