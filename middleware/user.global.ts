// export default defineNuxtRouteMiddleware(async (to) => {
//   const user = await useSupabaseUser();

//   if (user.value?.id && !to.path.startsWith('/tournaments')) {
//     return navigateTo('/tournaments');
//   }
// });