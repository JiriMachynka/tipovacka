import { router } from '../trpc';
import { matchRouter } from './match';
import { playerRouter } from './player';
import { tournamentRouter } from './tournament';
import { userRouter } from './user';
import { scorerRouter } from './scorer';

export const appRouter = router({
	tournament: tournamentRouter,
	user: userRouter,
	match: matchRouter,
	player: playerRouter,
	scorer: scorerRouter,
});

export type AppRouter = typeof appRouter;
