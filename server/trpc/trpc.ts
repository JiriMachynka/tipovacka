/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import { TRPCError, initTRPC } from '@trpc/server';
import type { Context } from '~/server/trpc/context';

const t = initTRPC.context<Context>().create();

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;
export const privateProcedure = publicProcedure.use(({ ctx, next }) => {
	if (!ctx.userId) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
		});
	}
	return next({
		ctx: {
			userId: ctx.userId,
		},
	});
});

export const router = t.router;