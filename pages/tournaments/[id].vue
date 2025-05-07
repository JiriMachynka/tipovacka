<script lang="ts" setup>
const { $client } = useNuxtApp();

const route = useRoute();

const tournamentId = +route.params.id;

const { data: tournament } = await $client.tournament.getData.useQuery({ tournamentId });

if (!tournament.value) {
	navigateTo('/');
}

useHead({
	titleTemplate: (title) => `${title} | ${tournament.value?.data.name}`,
});
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>