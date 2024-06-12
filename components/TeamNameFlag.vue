<script lang="ts" setup>
interface TeamNameFlagProps {
	teamName: string;
}

const props = defineProps<TeamNameFlagProps>();
const countries = ref(useCountries());
</script>
<template>
  <span :class="`text-lg fi fi-${countries.find((c) => c.name === props.teamName)?.code}`" />
  <span>{{ teamName }}</span>
</template>