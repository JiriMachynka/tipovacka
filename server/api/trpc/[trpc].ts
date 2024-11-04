import { createNuxtApiHandler } from 'trpc-nuxt';
import { createContext } from '~/server/trpc/context';
import { appRouter } from '~/server/trpc/routers';

// export API handler
export default createNuxtApiHandler({
	router: appRouter,
	createContext,
	responseMeta() {
		const ONE_MINUTE = 60;

		return {
			headers: {
				'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_MINUTE}`,
			},
		};
	},
});
