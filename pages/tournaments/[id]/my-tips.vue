<script lang="ts" setup>
import { AlertTriangle, Check, ChevronsUpDown } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const { $client } = useNuxtApp();

const route = useRoute();

const tournamentId = +route.params.id;

const { data: scorers, refresh } = await $client.scorer.getAll.useQuery({ tournamentId });
const { data: playerScorers } = await $client.scorer.getPlayerScorers.useQuery({ tournamentId });

const { mutate: updateScorers } = $client.scorer.updateScorers.useMutation();

const { handleSubmit } = useForm({
	validationSchema: toTypedSchema(
		z.object({
			firstScorerFirstName: z.string(),
			firstScorerLastName: z.string(),
			secondScorerFirstName: z.string(),
			secondScorerLastName: z.string(),
		}),
	),
	initialValues: {
		firstScorerFirstName: playerScorers.firstScorerFirstName || '',
		firstScorerLastName: playerScorers.firstScorerLastName || '',
		secondScorerFirstName: playerScorers.secondScorerFirstName || '',
		secondScorerLastName: playerScorers.secondScorerLastName || '',
	},
});

const onSubmit = handleSubmit(async (values) => {
	await updateScorers({
		tournamentId,
		firstScorerFirstName: values.firstScorerFirstName,
		firstScorerLastName: values.firstScorerLastName,
		secondScorerFirstName: values.secondScorerFirstName,
		secondScorerLastName: values.secondScorerLastName,
	});
	await refresh();
});

const firstScorerOpen = ref(false);
const firstScorerId = ref(0);

const selectedFirstScorer = computed(() => {
	parseInt(firstScorerId.value)
		? `${data.scorers.find((f) => f.id === +firstScorerId.value)?.firstName} ${data.scorers.find((f) => f.id === +firstScorerId.value)?.lastName}`
		: 'Vyber střelce';
});
</script>
<template>
  <form 
    class="w-full max-w-2xl mx-auto space-y-4"
    @submit="onSubmit"
  >
    <div :class="cn('grid grid-cols-[1fr_1fr_70px] gap-2', {
      'grid-cols-[1fr_1fr_1fr_70px]': scorers?.length && !playerScorers.lockScorers,
      })"
    >
      <!-- <div
        v-if="scorers.length > 0 && !playerScorers.lockScorers"
        class="space-y-2"
      >
        <Label>Střelec 1</Label>
        <Popover>
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="firstScorerOpen"
              class="w-full h-fit justify-between text-md font-normal"
            >
              {{ selectedFirstScorer }}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="max-w-[250px] mt-1 p-0">
            <Command v-model="firstScorerId">
              <CommandInput placeholder="Vyhledej střelce..." />
              <CommandEmpty>Střelec nebyl nalezen.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    v-for="scorer in scorers"
                    :key="scorer.id"
                    :value="scorer.id"
                    @select="(value) => {
                      if (parseInt(currentValue) !== parseInt(secondScorerValue) && parseInt(currentValue) !== parseInt(firstScorerValue)) {
                        firstScorerValue = currentValue;
                        firstScorerOpen = false;
                        closeAndFocusTrigger(ids.trigger);
                      }
                    }"
                    :class="cn('text-md hover:cursor-pointer', { 
                      'hover:cursor-default pointer-events-none': +firstScorerValue === scorer.id || +secondScorerValue === scorer.id, 
                    })"
                  >
                    <Check :class="cn('mr-2 size-4', value === scorer.id ? 'opacity-100' : 'opacity-0', )" />
                    {{ scorer.firstName }} {{ scorer.lastName }}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div> -->
      <FormField v-slot="{ componentField }" name="firstScorerFirstName">
        <FormItem>
          <FormLabel>Jméno</FormLabel>
          <FormControl>
            <Input type="text" v-bind="componentField" placeholder="Sydney" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="firstScorerLastName">
        <FormItem>
          <FormLabel>Příjmení</FormLabel>
          <FormControl>
            <Input type="text" v-bind="componentField" placeholder="Crosby" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="space-y-2">
        <Label class="content-center">Góly</Label>
        <Input
          class="w-[60px] text-center disabled:opacity-100"
          :value="scorers.firstScorerGoals"
          disabled
        />
      </div>
    </div>
    <div :class="cn('grid grid-cols-[1fr_1fr_70px] gap-2', {
      'grid-cols-[1fr_1fr_1fr_70px]': scorers?.length && !playerScorers.lockScorers,
      })"
    >
      <FormField v-slot="{ componentField }" name="secondScorerFirstName">
        <FormItem>
          <FormLabel>Jméno</FormLabel>
          <FormControl>
            <Input type="text" v-bind="componentField" placeholder="Roman" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="secondScorerLastName">
        <FormItem>
          <FormLabel>Příjmení</FormLabel>
          <FormControl>
            <Input type="text" v-bind="componentField" placeholder="Červenka" />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="space-y-2">
        <Label class="content-center">Góly</Label>
        <Input
          class="w-[60px] text-center disabled:opacity-100"
          :value="scorers.secondScorerGoals"
          disabled
        />
      </div>
    </div>
    <Card
      v-if="playerScorers.lockScorers"
      class="border-red-500"
    >
      <CardContent class="p-3 flex gap-4">
        <AlertTriangle color="red" class="size-8" />
        <p class="text-lg font-bold">Střelci byli uzamčeni</p>
      </CardContent>
    </Card>
    <Button
      v-else
      type="submit"
      class="w-full text-xl"
    >
      Uložit střelce
    </Button>
  </form>
  <div class="py-2" />
</template>