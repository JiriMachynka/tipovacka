<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';

const { toast } = useToast();
const supabaseClient = useSupabaseClient();

const validationSchema = toTypedSchema(
	z.object({
		email: z.string(),
		password: z.string(),
	}),
);

const { handleSubmit, isSubmitting, resetForm } = useForm({ validationSchema });

const onSubmit = handleSubmit(async (values) => {
	const { error } = await supabaseClient.auth.signInWithPassword({
		email: values.email,
		password: values.password,
	});

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
		title: 'Přihlášen',
		description: 'Úspěšně přihlášen!',
		duration: 3000,
	});

	navigateTo('/tournaments');
});
</script>
<template>
  <main class="containter flex flex-col gap-4 justify-center items-center h-dvh px-6 lg:px-0">
    <form class="flex flex-col gap-2 max-w-3xl w-full" @submit="onSubmit">
      <h1 class="text-4xl font-bold text-center">Přihlášení</h1>
			<FormField v-slot="{ componentField }" name="email">
				<FormItem>
					<FormLabel>Email</FormLabel>
					<FormControl>
						<Input type="text" v-bind="componentField" />
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
			<FormField v-slot="{ componentField }" name="password">
				<FormItem>
					<FormLabel>Heslo</FormLabel>
					<FormControl>
						<Input type="password" v-bind="componentField" />
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
      <Button
				type="submit"
				class="text-xl font-semibold"
				:disabled="isSubmitting"
			>
				Přihlásit se
			</Button>
    </form>
    <div class="flex flex-col items-center text-lg">
      <p class="font-semibold">
        Ještě nemáš účet?
      </p>
			<NuxtLink class="font-bold hover:underline" to="/register">
				Zaregistruj se zde.
			</NuxtLink>
    </div>
  </main>
</template>