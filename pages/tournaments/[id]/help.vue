<script lang="ts" setup>
import { z } from 'zod';

const schema = toTypedSchema(
	z.object({
		category: z.string(),
		description: z.string(),
	}),
);

const { $client, $config } = useNuxtApp();
const { toast } = useToast();

const route = useRoute();
const tournamentId = +route.params.id;

const { data: ownerEmail } = await $client.tournament.getOwnerEmail.useQuery({ tournamentId });

const { handleSubmit, isSubmitting } = useForm({
	validationSchema: schema,
	initialValues: {
		category: 'login',
	},
});

const categories = [
	{ value: 'login', label: 'Přihlášení' },
	{ value: 'match-tip', label: 'Tipy zápasů' },
	{ value: 'other', label: 'Ostatní' },
];

const onSubmit = handleSubmit(async (values) => {
	const error = await $fetch('/api/send', {
		query: {
			to: ownerEmail.value?.email as string,
			cc: ownerEmail.value?.email !== $config.public.myEmail ? $config.public.myEmail : undefined,
			category: categories.find((category) => category.value === values.category)?.label,
			description: values.description,
		},
	});

	if (error) {
		toast({
			title: 'Chyba',
			description: error.message,
			variant: 'destructive',
		});
		return;
	}
	toast({
		title: 'Poslali jsme Vám email',
		description: 'Pokud budete mít jiné problémy, určitě nás opět kontaktujte.',
		duration: 3000,
	});
});
</script>
<template>
  <form class="flex flex-col gap-4 max-w-2xl w-full mx-auto" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="category">
      <FormItem>
        <FormLabel>Kategorie</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Vyberte kategorii" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="category in categories"
                :key="category.value"
                :value="category.value"
              >
                {{ category.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Popište váš problém</FormLabel>
        <FormControl>
          <Textarea placeholder="Váš problém" class="resize-none" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit" class="text-xl font-semibold w-full">
      <Loader v-if="isSubmitting" class="mx-auto" svgClass="w-7 h-7" />
      <span v-else>Odeslat</span>
    </Button>
  </form>
</template>