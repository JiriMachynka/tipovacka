import type { inferAsyncReturnType } from '@trpc/server';
import type { H3Event } from 'h3';
import { serverSupabaseUser } from '#supabase/server';
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (event: H3Event) => {
	const user = await serverSupabaseUser(event);
	if (user) {
		return { userId: user.id };
	}
	return {};
};

export type Context = inferAsyncReturnType<typeof createContext>;
