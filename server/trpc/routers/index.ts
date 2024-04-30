import { router } from '../trpc';
import { matchRouter } from './match';
import { tournamentRouter } from './tournament';
import { userRouter } from './user';

export const appRouter = router({
	tournament: tournamentRouter,
	user: userRouter,
	match: matchRouter,
});

export type AppRouter = typeof appRouter;
