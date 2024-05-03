import { z } from 'zod';
import { privateProcedure, router } from '../trpc';

export const matchRouter = router({
	create: privateProcedure
		.input(
			z.object({
				tournamentId: z.number(),
				date: z.string(),
				group: z.string(),
				homeTeamId: z.number(),
				awayTeamId: z.number(),
			}),
		)
		.mutation(async ({ input }) => {
			const { tournamentId, date, group, homeTeamId, awayTeamId } = input;

			await createMatch(tournamentId, new Date(date), group, homeTeamId, awayTeamId);
		}),
	delete: privateProcedure.input(z.object({ matchId: z.number() })).mutation(async ({ input }) => {
		const { matchId } = input;

		await deleteMatch(matchId);
	}),
	edit: privateProcedure
		.input(
			z.object({
				matchId: z.number(),
				date: z.string(),
				group: z.string(),
				homeTeamId: z.number(),
				awayTeamId: z.number(),
			}),
		)
		.mutation(async ({ input }) => {
			const { matchId, date, group, homeTeamId, awayTeamId } = input;

			await editMatch(matchId, new Date(date), group, homeTeamId, awayTeamId);
		}),
	update: privateProcedure
		.input(
			z.object({
				matchId: z.number(),
				locked: z.boolean(),
			}),
		)
		.mutation(async ({ input }) => {
			const { matchId, locked } = input;

			await updateMatch(matchId, locked);
		}),
	finish: privateProcedure
		.input(
			z.object({
				matchId: z.number(),
				homeScore: z.number(),
				awayScore: z.number(),
			}),
		)
		.mutation(async ({ input }) => {
			const { matchId, homeScore, awayScore } = input;

			await finishMatch(matchId, homeScore, awayScore);
		}),
});
