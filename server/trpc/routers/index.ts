import { router } from '../trpc';
import { tournamentRouter } from './tournament';
import { userRouter } from './user';

export const appRouter = router({
	tournament: tournamentRouter,
	user: userRouter,
});

export type AppRouter = typeof appRouter;
