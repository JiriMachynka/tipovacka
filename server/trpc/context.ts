import type { inferAsyncReturnType } from '@trpc/server';
import { type H3Event, parseCookies } from 'h3';
import { jwtDecode } from 'jwt-decode';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = (event: H3Event) => {
	const accessToken = parseCookies(event)['sb-access-token'];
	if (accessToken) {
		const user = jwtDecode(accessToken);

		return {
			userId: user.sub,
		};
	}
	return {};
};

export type Context = inferAsyncReturnType<typeof createContext>;
