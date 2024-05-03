import { z } from 'zod';
import { privateProcedure, router } from '../trpc';

export const scorerRouter = router({
	getAll: privateProcedure.input(z.object({ tournamentId: z.number() })).query(async ({ input }) => {
		return await getScorers(input.tournamentId);
	}),
	getLockScorers: privateProcedure.input(z.object({ tournamentId: z.number() })).query(async ({ input }) => {
		return await getLockScorers(input.tournamentId);
	}),
	updateScorerGoals: privateProcedure
		.input(
			z.object({
				scorerId: z.number(),
				goals: z.number(),
				increment: z.boolean(),
			}),
		)
		.mutation(async ({ input }) => {
			return await updateScorerGoals(input.scorerId, input.goals, input.increment);
		}),
	updateLockScorers: privateProcedure
		.input(z.object({ tournamentId: z.number(), lockScorers: z.boolean() }))
		.mutation(async ({ input }) => {
			return await updateLockScorers(input.tournamentId, input.lockScorers);
		}),
});
