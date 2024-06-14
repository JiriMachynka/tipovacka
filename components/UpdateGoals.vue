<script lang="ts" setup>
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
	<Button
		v-if="goals > 0"
		variant="outline"
		class="p-2"
		@click="handleUpdate(false)"
	>
		<Minus />
	</Button>
	<div v-else class="w-[42px]" />
  <Button
		variant="outline"
		class="p-2"
		@click="handleUpdate(true)"
	>
    <Plus  />
  </Button>
</template>