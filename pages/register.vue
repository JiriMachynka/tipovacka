<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';

const validationSchema = toTypedSchema(
	z
		.object({
			username: z.string(),
			email: z.string(),
			password: z.string(),
			passwordConfirm: z.string(),
		})
		.refine((data) => data.password === data.passwordConfirm, {
			message: 'Hesla se neshodují',
		}),
);

const { toast } = useToast();
const supabaseClient = useSupabaseClient();

const { handleSubmit, isSubmitting, resetForm } = useForm({ validationSchema });

const onSubmit = handleSubmit(async (values) => {
	const { error } = await supabaseClient.auth.signUp({
		email: values.email,
		password: values.password,
		options: {
			data: {
				username: values.username,
				isAdmin: false,
			},
		},
	});

	if (error) {
		toast({
			title: error.name,
			description: error.message,
			variant: 'destructive',
		});
		return;
	}
	resetForm();

	toast({
		title: 'Zaregistrován',
		description: 'Účet byl úspěšně zaregistrován!',
	});

	navigateTo('/login');
});
</script>
<template>
  <main class="containter flex flex-col justify-center items-center gap-4 h-[100dvh]">
    <form class="flex flex-col gap-2 max-w-3xl w-full" @submit="onSubmit">
      <h1 class="text-3xl font-bold text-center">Registrace</h1>
      <FormField v-slot="{ componentField }" name="username">
				<FormItem>
					<FormLabel>Uživatelské jméno</FormLabel>
					<FormControl>
						<Input type="text" v-bind="componentField" />
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
      <FormField v-slot="{ componentField }" name="email">
				<FormItem>
					<FormLabel>Email</FormLabel>
					<FormControl>
						<Input type="email" v-bind="componentField" />
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
      <FormField v-slot="{ componentField }" name="passwordConfirm">
				<FormItem>
					<FormLabel>Heslo znovu</FormLabel>
					<FormControl>
						<Input type="password" v-bind="componentField" />
					</FormControl>
					<FormMessage />
				</FormItem>
			</FormField>
      <Button
				type="submit"
				:disabled="isSubmitting"
				class="w-full text-lg"
			>
        Registrovat se
      </Button>
    </form>
		<div class="flex flex-col items-center text-lg">
			<p class="text-lg text-center">
				Už máte účet?
			</p>
			<NuxtLink class="font-bold hover:underline" to="/login">
				Přihlaste se
			</NuxtLink> 
		</div>
  </main>
</template>