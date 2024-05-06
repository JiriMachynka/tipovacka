<script lang="ts" setup>
import { AlertTriangle, Check, ChevronsUpDown } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const { toast } = useToast();
const { $client } = useNuxtApp();

const route = useRoute();

const tournamentId = +route.params.id;

const { data: scorers, refresh } = await $client.scorer.getAll.useQuery({ tournamentId });
const { data: playerScorers } = await $client.scorer.getPlayerScorers.useQuery({ tournamentId });

const { mutate: updateScorers } = $client.scorer.updateScorers.useMutation();

const { handleSubmit, setFieldValue } = useForm({
	validationSchema: toTypedSchema(
		z.object({
			firstScorerFirstName: z.string(),
			firstScorerLastName: z.string(),
			secondScorerFirstName: z.string(),
			secondScorerLastName: z.string(),
		}),
	),
	initialValues: {
		firstScorerFirstName: playerScorers.value?.firstScorerFirstName || '',
		firstScorerLastName: playerScorers.value?.firstScorerLastName || '',
		secondScorerFirstName: playerScorers.value?.secondScorerFirstName || '',
		secondScorerLastName: playerScorers.value?.secondScorerLastName || '',
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

	toast({
		title: 'Aktualizováno',
		description: 'Střelci byli úspěšně aktualizováni!',
	});

	await refresh();
});

const firstScorerOpen = ref(false);
const firstScorerId = ref(playerScorers.value?.firstScorerId || 0);

const selectedFirstScorer = computed(() => {
	return firstScorerId.value && scorers?.value?.length > 0
		? `${scorers.value.find((f) => f.id === firstScorerId.value)?.firstName} ${scorers.value.find((f) => f.id === firstScorerId.value)?.lastName}`
		: 'Vyber střelce';
});

const secondScorerOpen = ref(false);
const secondScorerId = ref(playerScorers.value?.secondScorerId || 0);

const selectedSecondScorer = computed(() => {
	return secondScorerId.value && scorers?.value?.length > 0
		? `${scorers.value.find((f) => f.id === secondScorerId.value)?.firstName} ${scorers.value.find((f) => f.id === secondScorerId.value)?.lastName}`
		: 'Vyber střelce';
});
</script>
<template>
  <form 
    class="w-full max-w-3xl mx-auto space-y-4"
    @submit="onSubmit"
  >
    <div :class="cn('grid grid-cols-[1fr_1fr_70px] gap-2', {
      'grid-cols-[1fr_1fr_1fr_50px]': scorers?.length && !playerScorers.lockScorers,
      })"
    >
      <div
        v-if="scorers.length && !playerScorers.lockScorers"
        class="space-y-2"
      >
        <Label>Střelec 1</Label>
        <Popover>
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="firstScorerOpen"
              class="w-full h-auto justify-between text-md font-normal"
            >
              {{ selectedFirstScorer }}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="max-w-[250px] mt-1 p-0">
            <!-- TODO: Make this a select as user won't be able to type in the name -->
            <Command>
              <CommandEmpty>Střelec nebyl nalezen.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    v-for="scorer in scorers"
                    :key="scorer.id"
                    :value="scorer.id"
                    @select="(e) => { 
                      const currentValue = e.detail.value;
                      if (currentValue !== secondScorerId && currentValue !== firstScorerId) {
                        firstScorerId = currentValue ?? 0;
                        setFieldValue('firstScorerFirstName', scorers.find((s) => s.id === firstScorerId)?.firstName);
                        setFieldValue('firstScorerLastName', scorers.find((s) => s.id === firstScorerId)?.lastName);
                        firstScorerOpen = false;
                      }
                    }"
                    :class="cn('text-md hover:cursor-pointer', {
                      'hover:cursor-default pointer-events-none': firstScorerId === scorer.id || secondScorerId === scorer.id,
                    })"
                  >
                    <Check :class="cn('mr-2 size-4', 
                      firstScorerId === scorer.id || secondScorerId === scorer.id ? 'opacity-100' : 'opacity-0'
                    )" />
                    {{ scorer.firstName }} {{ scorer.lastName }}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <FormField v-slot="{ componentField }" name="firstScorerFirstName">
        <FormItem>
          <FormLabel>Jméno</FormLabel>
          <FormControl>
            <Input
              type="text"
              v-bind="componentField"
              placeholder="Sydney"
              @click="() => {
                firstScorerId = 0;
                setFieldValue('firstScorerFirstName', '');
              }"
              :disabled="playerScorers?.lockScorers"
            /> 
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="firstScorerLastName">
        <FormItem>
          <FormLabel>Příjmení</FormLabel>
          <FormControl>
            <Input
              type="text"
              v-bind="componentField"
              placeholder="Crosby"
              @click="() => {
                firstScorerId = 0
                setFieldValue('firstScorerLastName', '');
              }"
              :disabled="playerScorers?.lockScorers"
            />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="space-y-2">
        <Label>Góly</Label>
        <div class="w-[50px] h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-center disabled:opacity-100 select-none">
          {{ playerScorers.firstScorerGoals }}
        </div>
      </div>
    </div>
    <div :class="cn('grid grid-cols-[1fr_1fr_70px] gap-2', {
      'grid-cols-[1fr_1fr_1fr_50px]': scorers?.length && !playerScorers.lockScorers,
      })"
    >
      <div
        v-if="scorers?.length && !playerScorers.lockScorers"
        class="space-y-2"
      >
        <Label>Střelec 2</Label>
        <Popover>
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="secondScorerOpen"
              class="w-full h-fit justify-between text-md font-normal"
            >
              {{ selectedSecondScorer }}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="max-w-[250px] mt-1 p-0">
            <Command>
              <CommandEmpty>Střelec nebyl nalezen.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    v-for="scorer in scorers"
                    :key="scorer.id"
                    :value="scorer.id"
                    @select="(e) => {
                      const currentValue = e.detail.value;
                      if (currentValue !== secondScorerId && currentValue !== firstScorerId) {  
                        secondScorerId = currentValue ?? 0;
                        setFieldValue('secondScorerFirstName', scorers.find((s) => s.id === secondScorerId)?.firstName);
                        setFieldValue('secondScorerLastName', scorers.find((s) => s.id === secondScorerId)?.lastName);
                        secondScorerOpen = false;
                      }
                    }"
                    :class="cn('text-md hover:cursor-pointer', { 
                      'hover:cursor-default pointer-events-none': firstScorerId === scorer.id || secondScorerId === scorer.id,
                    })"
                  >
                    <Check :class="cn('mr-2 size-4', 
                      firstScorerId === scorer.id || secondScorerId === scorer.id ? 'opacity-100' : 'opacity-0', 
                    )" /> 
                    {{ scorer.firstName }} {{ scorer.lastName }}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <FormField v-slot="{ componentField }" name="secondScorerFirstName">
        <FormItem>
          <FormLabel>Jméno</FormLabel>
          <FormControl>
            <Input
              type="text"
              v-bind="componentField"
              placeholder="Roman"
              @click="() => {
                secondScorerId = 0;
                setFieldValue('secondScorerFirstName', '');
              }"
              :disabled="playerScorers?.lockScorers"
            />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="secondScorerLastName">
        <FormItem>
          <FormLabel>Příjmení</FormLabel>
          <FormControl>
            <Input
              type="text"
              v-bind="componentField"
              placeholder="Červenka"
              @click="() => {
                secondScorerId = 0
                setFieldValue('secondScorerLastName', '');
              }"
              :disabled="playerScorers?.lockScorers"
            />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="space-y-2">
        <Label class="content-center">Góly</Label>
        <div class="w-[50px] h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-center disabled:opacity-100 select-none">
          {{ playerScorers.secondScorerGoals }}
        </div>
      </div>
    </div>
    <Card
      v-if="playerScorers?.lockScorers"
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
      class="w-full text-xl font-bold"
    >
      Uložit střelce
    </Button>
  </form>
  <div class="py-2" />
</template>