<script lang="ts" setup>
const { $client } = useNuxtApp();

const route = useRoute();

const tournamentId = +route.params.id;

const { data: tournament } = await $client.tournament.getData.useQuery({ tournamentId });

if (!tournament.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Tipovačka nebyla nalezena',
  })
}

useHead({
  titleTemplate: (title) => `${title} | ${tournament.value?.data[0].name}`,
});
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>