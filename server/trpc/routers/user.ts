import { privateProcedure, router } from '../trpc';

export const userRouter = router({
	me: privateProcedure.query(async ({ ctx }) => await getUserInfo(ctx.userId)),
});
