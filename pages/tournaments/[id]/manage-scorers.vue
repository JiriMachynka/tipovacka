<script lang="ts" setup>
const route = useRoute();

const tournamentId = +route.params.id;

const { $client } = useNuxtApp();

const { data: scorers, refresh } = await $client.scorer.getAll.useQuery({ tournamentId });
</script>
<template>
  <LockScorers :tournamentId="tournamentId" />
  <Table
    v-if="!!scorers?.length"
    class="mx-auto max-w-4xl mt-5"
  >
    <TableHeader>
      <TableRow class="grid grid-cols-[1fr_80px_120px]">
        <TableHead>Jméno a příjmení</TableHead>
        <TableHead>Góly</TableHead>
        <TableHead>Akce</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow 
        v-for="scorer in scorers"
        :key="scorer.id"
        class="grid grid-cols-[1fr_80px_120px] items-center py-1"
      >
        <TableCell class="text-xl font-bold">
          {{ scorer.firstName }} {{ scorer.lastName }}
        </TableCell>
        <TableCell class="text-xl font-bold">{{ scorer.goals }}</TableCell>
        <TableCell class="flex justify-center gap-2 px-3">
          <UpdateGoals
            :scorerId="scorer.id"
            :goals="scorer.goals"
            @refresh="refresh"
          />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>