export default defineNuxtRouteMiddleware(async () => {
  const user = await useSupabaseUser();
  if (user) navigateTo('/tournaments');
});