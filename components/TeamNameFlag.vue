<script lang="ts" setup>
interface TeamNameFlagProps {
	showImg?: boolean;
	teamName: string;
}

const props = defineProps<TeamNameFlagProps>();
// const countries = ref(useTeams());
const countries = ref(useCountries());
</script>
<template>
  <span class="inline-flex items-center gap-4">
    <NuxtImg v-if="props.showImg" preload :src="`/teams${countries.find((c) => c.name === props.teamName)?.code}.png`" class="h-6 w-6" />
    <span v-else :class="`text-lg fi fi-${countries.find((c) => c.name === props.teamName)?.code}`" />
    <span>{{ teamName }}</span>
  </span>
</template>