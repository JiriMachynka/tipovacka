import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const tokenHash = query.token_hash as string;
  const redirectTo = query.redirectUrl as string;

  // if (!tokenHash) return await sendRedirect(event, '/', 301);

  const client = await serverSupabaseClient(event);
  await client.auth.verifyOtp({
    type: 'recovery',
    token_hash: tokenHash,
    options: {
      redirectTo
    }
  });

  return await sendRedirect(event, '/reset-password');
})
