<script lang="ts" setup>
interface UpdateMatchStatusProps {
	tournamentId: number;
}

const props = defineProps<UpdateMatchStatusProps>();

const { toast } = useToast();
const { $client } = useNuxtApp();

const { data, refresh } = await $client.scorer.getLockScorers.useQuery({ tournamentId: props.tournamentId });

const { mutate: updateLockScorers } = $client.scorer.updateLockScorers.useMutation();

const handleLock = async (lockScorers: boolean) => {
	await updateLockScorers({
		tournamentId: props.tournamentId,
		lockScorers,
	});
	await refresh();
	toast({
		title: `${lockScorers ? 'Uzamčeno' : 'Odemčeno'}`,
		description: `Střelci byli ${lockScorers ? 'uzamčeni' : 'odemčeni'}`,
	});
};
</script>
<template>
  <div class="flex items-center gap-4 max-w-4xl mx-auto">
    <Button variant="ghost" class="px-2" @click="handleLock(!data!.lockScorers)">
      <IconLock
        v-if="!data?.lockScorers"
        class="cursor-pointer"
      />
      <IconUnlock
        v-else
        class="cursor-pointer"
      />
    </Button>
    <Label>{{ data?.lockScorers ? 'Střelci uzamčeni' : 'Střelci odemčeni' }}</Label>
  </div>
</template>