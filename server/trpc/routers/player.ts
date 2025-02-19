import { z } from 'zod';
import { privateProcedure, router } from '../trpc';

export const playerRouter = router({
	getTournament: privateProcedure.input(z.object({ tournamentId: z.number() })).query(async ({ ctx, input }) => {
		return await getTournamentPlayers(input.tournamentId, ctx.userId);
	}),
	add: privateProcedure
		.input(
			z.object({
				tournamentId: z.number(),
				username: z.string(),
			}),
		)
		.mutation(async ({ input }) => await addPlayer(input.tournamentId, input.username)),
	delete: privateProcedure
		.input(
			z.object({
				playerId: z.number(),
			}),
		)
		.mutation(async ({ input }) => {
			return await deletePlayer(input.playerId);
		}),
	getMatchTips: privateProcedure.input(z.object({ playerId: z.number() })).query(async ({ input }) => await getPlayerMatchTips(input.playerId)),
});
