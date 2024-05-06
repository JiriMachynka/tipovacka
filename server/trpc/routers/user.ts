import { privateProcedure, router } from '../trpc';

export const userRouter = router({
	me: privateProcedure.query(async ({ ctx }) => await getUserInfo(ctx.userId)),
	getAll: privateProcedure.query(async ({ ctx }) => await getAllUsers(ctx.userId)),
});
