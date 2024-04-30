import { z } from 'zod';
import { privateProcedure, router } from '../trpc';

export const matchRouter = router({
	create: privateProcedure
		.input(
			z.object({
				tournamentId: z.number(),
				date: z.date(),
				group: z.string(),
				homeTeamId: z.number(),
				awayTeamId: z.number(),
			}),
		)
		.mutation(async ({ input }) => {
			const { tournamentId, date, group, homeTeamId, awayTeamId } = input;

			await createMatch(tournamentId, new Date(date), group, homeTeamId, awayTeamId);
		}),
});
