import { z } from 'zod';
import { privateProcedure, router } from '../trpc';

export const userRouter = router({
	me: privateProcedure.query(async ({ ctx }) => await getUserInfo(ctx.userId)),
	getAll: privateProcedure
		.input(z.object({ tournamentId: z.number() }))
		.query(async ({ ctx, input }) => await getAllUsers(ctx.userId, input.tournamentId)),
});
