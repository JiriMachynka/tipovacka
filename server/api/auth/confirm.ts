import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const tokenHash = query.token_hash as string;

  if (!tokenHash) return await sendRedirect(event, '/', 301);

  const client = await serverSupabaseClient(event);
  const { data: { session }} = await client.auth.verifyOtp({
    type: 'email',
    token_hash: tokenHash,
  });

  if (!session?.access_token || !session.refresh_token) return await sendRedirect(event, '/', 301);

  await client.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token
  });
})
