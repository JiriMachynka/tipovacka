<script lang="ts" setup>
import { Plus, Minus } from 'lucide-vue-next';

interface UpdateGoalsProps {
	scorerId: number;
	goals: number;
}

const emit = defineEmits(['refresh']);

const props = defineProps<UpdateGoalsProps>();

const { $client } = useNuxtApp();

const { mutate: updateScorerGoals } = $client.scorer.updateScorerGoals.useMutation();

const handleUpdate = async (increment: boolean) => {
	await updateScorerGoals({
		scorerId: props.scorerId,
		goals: props.goals,
		increment,
	});
	await emit('refresh');
};
</script>
<template>
  <Button variant="outline" class="p-3">
		<Minus
			v-if="goals === 0"
			@click="handleUpdate(false)"
		/>
    <Plus @click="handleUpdate(true)" />
  </Button>
</template>