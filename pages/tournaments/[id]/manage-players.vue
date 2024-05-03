<script lang="ts" setup>
const route = useRoute();

const tournamentId = +route.params.id;

const { $client } = useNuxtApp();

const { data: players, refresh } = await $client.player.getAll.useQuery({ tournamentId });
</script>
<template>
  <AddPlayerForm
    :tournamentId="tournamentId"
    @refresh="refresh"
  />
  <Table
    v-if="!!players?.length"
    class="mt-5"
  >
    <TableHeader>
      <TableRow>
        <TableHead>Přezdívka</TableHead>
        <TableHead>Email</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="player in players"
        :key="player.id"
      >
        <TableCell>{{ player.username }}</TableCell>
        <TableCell>{{ player.email }}</TableCell>
        <TableCell>
          <DeletePlayerDialog
            :username="player.username"
            :playerId="player.id"
            @refresh="refresh"
          />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>