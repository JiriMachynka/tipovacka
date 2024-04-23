<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toast } from '~/components/ui/toast';

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

const supabaseClient = useSupabaseClient();

const { defineField, handleSubmit, isSubmitting, resetForm, errors } = useForm({ validationSchema });

const [username, usernameAttrs] = defineField('username');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const [passwordConfirm, passwordConfirmAttrs] = defineField('passwordConfirm');

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

	navigateTo('/');
});
</script>
<template>
  <main class="containter flex flex-col justify-center items-center gap-4 h-[100dvh]">
    <form class="flex flex-col gap-2 max-w-3xl w-full" @submit="onSubmit">
      <h1 class="text-3xl font-bold text-center">Registrace</h1>
      <div class="flex flex-col gap-4">
        <Label html="username">Uživatelské jméno</Label>
        <Input id="username" v-model="username" v-bind="usernameAttrs" />
        <span v-if="errors.username">{{ errors.username }}</span>
      </div>
      <div class="flex flex-col gap-4">
        <Label html="email">Email</Label>
        <Input id="email" v-model="email" v-bind="emailAttrs" />
        <span v-if="errors.email">{{ errors.email }}</span>
      </div>
      <div class="flex flex-col gap-4">
        <Label html="password">Heslo</Label>
        <Input id="password" type="password" v-model="password" v-bind="passwordAttrs" />
        <span v-if="errors.password">{{ errors.password }}</span>
      </div>
      <div class="flex flex-col gap-4">
        <Label html="passwordConfirm">Heslo znovu</Label>
        <Input id="passwordConfirm" type="password" v-model="passwordConfirm" v-bind="passwordConfirmAttrs" />
        <span v-if="errors.passwordConfirm">{{ errors.passwordConfirm }}</span>
      </div>
      <Button type="submit" :disabled="isSubmitting" class="w-full text-lg">
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