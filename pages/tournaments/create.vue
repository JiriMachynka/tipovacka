<script lang="ts" setup>
import type { Country } from '@/types';
import { Sortable } from 'sortablejs-vue3';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';

const validationSchema = toTypedSchema(
	z.object({
		tournamentName: z.string({ required_error: 'Název je vyžadován' }).min(3, { message: 'Název je vyžadován' }).trim(),
		players: z.string().optional(),
	}),
);

const { toast } = useToast();
const { $client } = useNuxtApp();

const user = await $client.user.me.query();

const { mutate: createTournament } = $client.tournament.create.useMutation();

const { handleSubmit, isSubmitting } = useForm({
	validationSchema,
	initialValues: {
		tournamentName: '',
		players: '',
	},
});

const onSubmit = handleSubmit(async (values) => {
	const { tournamentName, players } = values;

	const allPlayers = players?.split('\n').filter((player) => player.trim() !== '') || [];

	const tournamentId = await createTournament({
		tournamentName,
		teams: teams.value,
		players: [user.username, ...allPlayers],
	});

	navigateTo(`/tournaments/${tournamentId}`);
});

const countries = ref<Omit<Country, 'group'>[]>(useCountries());
// const countries = ref<Omit<Country, 'group'>[]>(useTeams());
const currentCountry = ref('');
const teams = ref<Country[]>([]);
const numberOfGroups = ref(1);

watch(currentCountry, (country) => {
	// TODO: Reset country after assigning to group
	const countryToPush = JSON.parse(country) as Country;
	teams.value.push(countryToPush);
	countries.value = countries.value.filter((team) => team.code !== countryToPush.code);
	toast({
		title: 'Země přidána',
		description: `${countryToPush.name} je úspěšně přidána`,
		duration: 1000,
	});
});

watch(numberOfGroups, (newNumber, oldNumber) => {
	if (newNumber < oldNumber) {
		teams.value.map((t) => {
			if (t.group >= newNumber) {
				// Number of groups starts from 1, but groups are indexed from 0
				t.group = newNumber - 1;
			}
		});
	}
});

const changeGroup = (countryCode: string, group: number) => {
	teams.value.map((team) => {
		if (team.code === countryCode) {
			team.group = group;
		}
	});
};

const removeCountry = (countryCode: string) => {
	const country = teams.value.find((t) => t.code === countryCode) as Country;
	countries.value.push({ name: country.name, code: country.code });
	countries.value.sort((a, b) => a.name.localeCompare(b.name));
	teams.value = teams.value.filter((team) => team.code !== countryCode);
};
</script>
<template>
  <div class="flex flex-col h-dvh">
    <Button 
      class="w-fit mx-auto my-3"
      @click="navigateTo('/tournaments')" 
    > 
      Zpět na tipovačky
    </Button>
    <form class="flex flex-col gap-5 mx-3 lg:w-full lg:max-w-screen-lg lg:mx-auto" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="tournamentName">
        <FormItem>
          <FormLabel>Název tipovačky</FormLabel>
          <FormControl>
            <Input
              type="text"
              v-bind="componentField"
              placeholder="Název tipovačky"
              class="w-full"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="players">
        <FormItem>
          <FormLabel class="inline-flex gap-2">
            Hráči
            <InfoTooltip class="*:text-base">
              <p>Hráči se zadávají ve formátu:</p>
              <p>Každý hráč na novém řádku</p>
            </InfoTooltip>
          </FormLabel>
          <FormControl>
            <Textarea
              type="text"
              v-bind="componentField"
              class="w-full h-52"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2 w-full">
          <Label>Týmy</Label>
          <Select v-model="currentCountry">
            <SelectTrigger class="max-w-xl w-full">
              <SelectValue placeholder="Vyberte zemi" />
            </SelectTrigger>
            <SelectContent :class="cn('max-w-xl w-full')">
              <SelectGroup>
                <SelectItem
                  v-for="country in countries"
                  :key="country.code"
                  :value="JSON.stringify(Object.assign({}, country, { group: 0 }))"
                >
                  <span class="inline-flex items-center gap-4">
                    <TeamNameFlag :teamName="country.name" />
                  </span>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="flex flex-col gap-2 w-fit justify-self-center">
          <Label>Počet skupin</Label>
          <div class="flex gap-2">
            <Input :class="cn('w-[70px] mr-2')" type="number" v-model="numberOfGroups" min="1" />
            <Button
              type="button"
              variant="outline"
              :class="cn('p-2')"
              :disabled="numberOfGroups === 1"
              @click="() => (numberOfGroups--)"
            >
              <IconMinus class="size-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              :class="cn('p-2')"
              @click="() => (numberOfGroups++)"
            >
              <IconPlus class="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div
        class="grid gap-4 overflow-x-auto"
        :style="{ 'grid-template-columns': `repeat(${numberOfGroups}, 1fr)` }"
      >
        <div
          v-for="(_, index) in numberOfGroups"
          :class="`border border-input px-7 py-3 w-full rounded-md ${teams.length > 0 && 'space-y-4'}`"
        >
          <span class="text-lg font-bold">Skupina {{ String.fromCharCode(65 + index) }}</span>
          <Sortable
            :list="teams.filter(t => t.group === index)"
            item-key="code"
            class="flex flex-col justify-start gap-2"
            :options="{ animation: 200 }"
          >
            <template #item="{ element }">
              <div class="draggable cursor-move border border-input px-4 py-2 w-full rounded-md" :key="element.code">
                <div class="flex justify-between items-center gap-6">
                  <div class="flex items-center gap-4">
                    <IconGripVertical class="-mr-2 size-5" />
                    <!-- <span :class="`text-lg fi fi-${element.code}`" /> -->
                    <img :src="`/teams/${element.code}.png`" class="h-6 w-6" />
                    <span class="text-base">{{ element.name }}</span>
                  </div>
                  <div class="grid grid-cols-[38px_38px_38px] gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      :class="cn('p-2')"
                      @click="removeCountry(element.code)"
                    >
                      <IconTrash class="size-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      :class="cn('p-2')"
                      :disabled="element.group === 0"
                      @click="changeGroup(element.code, index - 1)"
                    >
                      <IconChevronLeft class="size-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      :class="cn('p-2')"
                      :disabled="element.group === numberOfGroups - 1"
                      @click="changeGroup(element.code, index + 1)"
                    >
                      <IconChevronRight class="size-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </template>
          </Sortable>
        </div>
      </div>
      <Button
        class="text-xl py-3 lg:text-3xl font-semibold"
        type="submit"
        :disabled="isSubmitting"
      >
        Vytvořit tipovačku
      </Button>
    </form>
  </div>
</template>