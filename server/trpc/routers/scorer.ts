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
		.mutation(async ({ input }) => await updateLockScorers(input.tournamentId, input.lockScorers)),
	getPlayerScorers: privateProcedure.input(z.object({ tournamentId: z.number() })).query(async ({ ctx, input }) => await getPlayerScorers(input.tournamentId, ctx.userId)),
	updateScorers: privateProcedure
		.input(
			z.object({
				tournamentId: z.number(),
				firstScorerFirstName: z.string(),
				firstScorerLastName: z.string(),
				secondScorerFirstName: z.string(),
				secondScorerLastName: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { tournamentId, firstScorerFirstName, firstScorerLastName, secondScorerFirstName, secondScorerLastName } = input;
			await updateScorers(ctx.userId, tournamentId, firstScorerFirstName, firstScorerLastName, secondScorerFirstName, secondScorerLastName);
		}),
});
