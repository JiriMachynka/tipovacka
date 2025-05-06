<script lang="ts" setup>
interface PlayerTipsDialogProps {
	username: string;
	playerId: number;
}

const props = defineProps<PlayerTipsDialogProps>();

const { $client } = useNuxtApp();

const {
	data: playerTips,
	execute,
	status,
} = await $client.player.getMatchTips.useQuery(
	{ playerId: props.playerId },
	{
		immediate: false,
	},
);
</script>
<template>
  <Dialog>
    <DialogTrigger :class="cn('inline-flex gap-2 w-full')" @click="execute">
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle class="text-2xl font-bold">
          Tipy hráče {{ props.username }}
        </DialogTitle>
        <DialogDescription :class="cn('overflow-y-auto max-h-[400px]', {
          'min-h-[150px] flex justify-center items-center': status === 'pending',
        })">
          <Loader v-if='status === "pending"' svgClass="w-14 h-14" />
          <div
            v-else-if="status === 'success'"
            v-for="{ id, homeTeamName, awayTeamName, homeScore, awayScore } in playerTips"
            :key="id"
            class="grid grid-cols-[1fr_70px] items-center gap-2 group"
          >
            <span class="flex flex-col gap-1 font-semibold">
              <TeamNameFlag :teamName="homeTeamName" />
              <TeamNameFlag :teamName="awayTeamName" />
            </span>
            <span class="text-xl">
              {{ homeScore }} : {{ awayScore }}
            </span>
            <Separator class="col-span-2 my-2 group-last:hidden" />
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>