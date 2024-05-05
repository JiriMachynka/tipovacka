<script lang="ts" setup>
import { Unlock, Lock } from 'lucide-vue-next';

interface UpdateMatchStatusProps {
	tournamentId: number;
}

const props = defineProps<UpdateMatchStatusProps>();

const { $client } = useNuxtApp();

const { data, refresh } = await $client.scorer.getLockScorers.useQuery({ tournamentId: props.tournamentId });

const { mutate: updateLockScorers } = $client.scorer.updateLockScorers.useMutation();

const handleLock = async (lockScorers: boolean) => {
	await updateLockScorers({
		tournamentId: props.tournamentId,
		lockScorers,
	});
	await refresh();
};
</script>
<template>
  <div class="flex items-center gap-4 max-w-4xl mx-auto">
    <Button variant="ghost" class="px-2" @click="handleLock(!data!.lockScorers)">
      <Lock
        v-if="!data?.lockScorers"
        class="cursor-pointer"
      />
      <Unlock
        v-else
        class="cursor-pointer"
      />
    </Button>
    <Label>{{ data?.lockScorers ? 'Střelci uzamčeni' : 'Střelci odemčeni' }}</Label>
  </div>
</template>