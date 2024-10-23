<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';

const { toast } = useToast();
const supabaseClient = useSupabaseClient();

const validationSchema = toTypedSchema(
	z.object({
		email: z.string(),
	}),
);

const { handleSubmit, isSubmitting, resetForm } = useForm({ validationSchema });

const onSubmit = handleSubmit(async (values) => {
	const { error } = await supabaseClient.auth.resetPasswordForEmail(values.email);

	if (error) {
		toast({
			title: 'Error',
			description: error.message,
			variant: 'destructive',
		});
		return;
	}
	resetForm();

	toast({
		title: 'Email odeslán',
		description: 'Email s odkazem pro změnu hesla byl úspěšně odeslán!',
		duration: 3000,
	});

	navigateTo('/');
});
</script>
<template>
  <main class="container flex flex-col gap-4 justify-center items-center h-dvh">
    <form class="flex flex-col gap-2 max-w-3xl w-full" @submit="onSubmit">
      <h1 class="text-4xl font-bold text-center">Zapomenuté heslo</h1>
			<FormField v-slot="{ componentField }" name="email">
				<FormItem>
					<FormLabel>Email</FormLabel>
					<FormControl>
						<Input type="text" v-bind="componentField" />
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
      <Button
				type="submit"
				class="text-xl font-semibold"
				:disabled="isSubmitting"
			>
        Obnovit heslo
			</Button>
      <div class="flex justify-between w-full">
        <NuxtLink class="font-bold hover:underline" to="/register">
          Zaregistruj se zde.
        </NuxtLink>
        <NuxtLink class="font-bold hover:underline" to="/login">
          Přihlaste se
        </NuxtLink> 
      </div>
    </form>
  </main>
</template>