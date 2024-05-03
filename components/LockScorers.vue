<script lang="ts" setup>
import { Unlock, Lock } from 'lucide-vue-next';

interface UpdateMatchStatusProps {
  tournamentId: number;
	lockScorers: boolean;
}

const emit = defineEmits(['refresh']);

const props = defineProps<UpdateMatchStatusProps>();

const { $client } = useNuxtApp();

const { mutate: updateLockScorers } = $client.scorer.updateLockScorers.useMutation();

const handleLock = async (lockScorers: boolean) => {
	await updateLockScorers({
    tournamentId: props.tournamentId,
		lockScorers,
	});
  await emit('refresh');
};

</script>
<template>
  <div class="flex items-center gap-4 max-w-4xl mx-auto">
    <Button variant="ghost" class="px-2">
      <Lock
        v-if="!lockScorers"
        class="cursor-pointer"
        @click="handleLock(true)"
      />
      <Unlock
        v-else
        class="cursor-pointer"
        @click="handleLock(false)"
      />
    </Button>
    <Label>{{ lockScorers ? 'Střelci uzamčeni' : 'Střelci odemčeni' }}</Label>
  </div>
</template>