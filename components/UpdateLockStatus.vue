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

	emit('refresh');

	toast({
		title: locked ? 'Odemčeno' : 'Zamčeno',
		description: `Zápas byl úspěšně ${locked ? 'odemčen' : 'zamčen'}`,
	});
};
</script>
<template>
  <Button variant="ghost" class="px-2">
    <IconLock v-if="!locked" class="cursor-pointer" @click="handleUpdate(matchId, true)" />
    <IconUnlock v-else class="cursor-pointer" @click="handleUpdate(matchId, false)" />
  </Button>
</template>