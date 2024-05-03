<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const emit = defineEmits(['refresh']);

const { $client } = useNuxtApp();

const props = defineProps<{ tournamentId: number }>();

const { handleSubmit } = useForm({
	validationSchema: toTypedSchema(
		z.object({
			username: z.string(),
		}),
	),
});

const { mutate: addPlayer } = $client.player.add.useMutation();

const onSubmit = handleSubmit(async (values) => {
	await addPlayer({
		tournamentId: props.tournamentId,
		username: values.username,
	});
	await emit('refresh');
});
</script>
<template>
  <form
    class="w-full max-w-xl mx-auto flex flex-col gap-4"
    @submit="onSubmit"
  >
    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>Přezdívka</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button 
      type="submit"
      class="w-full text-xl"
    >
      Přidat hráče
    </Button>
  </form>
</template>