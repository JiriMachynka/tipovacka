<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toast } from '~/components/ui/toast';

const supabaseClient = useSupabaseClient();

const validationSchema = toTypedSchema(
	z.object({
		email: z.string(),
		password: z.string(),
	}),
);

const { defineField, handleSubmit, isSubmitting, resetForm } = useForm({
	validationSchema,
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

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
  <main class="containter flex flex-col gap-4 justify-center items-center h-[100dvh]">
    <form class="flex flex-col gap-2 max-w-3xl w-full" @submit="onSubmit">
      <h1 class="text-3xl font-bold text-center">Přihlášení</h1>
      <div class="flex flex-col gap-4">
        <Label html="email">Email</Label>
        <Input id="email" v-model="email" v-bind="emailAttrs" />
      </div>
      <div class="flex flex-col gap-4">
        <Label html="password">Heslo</Label>
        <Input id="password" type="password" v-model="password" v-bind="passwordAttrs" autocomplete="off" />
      </div>
      <Button type="submit" :disabled="isSubmitting">Přihlásit se</Button>
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