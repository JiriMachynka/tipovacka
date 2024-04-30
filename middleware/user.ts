export default defineNuxtRouteMiddleware(async () => {
  const user = await useSupabaseUser();
  if (user.value?.id) navigateTo('/tournaments');
});