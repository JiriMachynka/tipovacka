<script lang="ts" setup>
definePageMeta({
	middleware: [
		(to) => {
			const session = useSupabaseSession();

			if (session.value && to.path === '/') {
				return navigateTo('/tournaments', {
					replace: true,
					redirectCode: 302,
				});
			}
		},
	],
});
</script>
<template>
  <div class="flex flex-col justify-center items-center h-[100dvh]">
    <Button class="text-4xl px-7 py-5" as-child>
      <NuxtLink to="/login">
        Přihlásit se
      </NuxtLink>
    </Button>
  </div>
</template>