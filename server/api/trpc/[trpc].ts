import { createNuxtApiHandler } from 'trpc-nuxt';
import { createContext } from '~/server/trpc/context';
import { appRouter } from '~/server/trpc/routers';

// export API handler
export default createNuxtApiHandler({
	router: appRouter,
	createContext,
	responseMeta(opts) {
		const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

		return {
			headers: {
				'cache-control': `s-maxage=5, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
			}
		}
	}
});
