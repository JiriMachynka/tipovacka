<script lang="ts" setup>
import type { User } from '@supabase/supabase-js';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';

const route = useRoute();
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

const code = route.query?.code as string;
const user = ref<User | null>();
const { handleSubmit, isSubmitting, resetForm } = useForm({ validationSchema });

const onSubmit = handleSubmit(async (values) => {
	const { error } = await supabaseClient.auth.updateUser({
		password: values.password,
	});

	if (error) {
		toast({
			title: 'Chyba',
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

onMounted(() => {
	if (!code) navigateTo('/');
	supabaseClient.auth.exchangeCodeForSession(code).then(({ data, error }) => {
		if (error) {
			toast({
				title: error.name,
				description: error.message,
				duration: 3000,
			});
			return;
		}

		if (data.session) supabaseClient.auth.setSession(data.session);
	});
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