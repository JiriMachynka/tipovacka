<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';

const { toast } = useToast();
const supabaseClient = useSupabaseClient();

const validationSchema = toTypedSchema(
	z
		.object({
			password: z.string(),
			passwordConfirm: z.string(),
		})
		.refine((data) => data.password === data.passwordConfirm, {
			message: 'Hesla se neshodují',
		}),
);

const { handleSubmit, isSubmitting, resetForm } = useForm({ validationSchema });

const onSubmit = handleSubmit(async (values) => {
	const { error } = await supabaseClient.auth.updateUser({
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
		title: 'Heslo změněno',
		description: 'Heslo bylo úspěšně změněno!',
		duration: 3000,
	});

	navigateTo('/login');
});
</script>
<template>
  <main class="container flex flex-col gap-4 justify-center items-center h-dvh">
    <form class="flex flex-col gap-2 max-w-3xl w-full" @submit="onSubmit">
      <h1 class="text-4xl font-bold text-center">Obnovení hesla</h1>
			<FormField v-slot="{ componentField }" name="password">
				<FormItem>
					<FormLabel>Heslo</FormLabel>
					<FormControl>
						<Input type="password" v-bind="componentField" />
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
      <FormField v-slot="{ componentField }" name="passwordConfirm">
				<FormItem>
					<FormLabel>Heslo znova</FormLabel>
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