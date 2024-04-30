import { z } from 'zod';
import { privateProcedure, router } from '../trpc';

export const tournamentRouter = router({
	getAll: privateProcedure.query(async ({ ctx }) => await getTournaments(ctx.userId)),
	create: privateProcedure
		.input(
			z.object({
				tournamentName: z.string(),
				teams: z.array(z.array(z.string())),
				players: z.array(z.string()),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { tournamentName, players, teams } = input;
			return await createTournament(ctx.userId, tournamentName, players, teams);
		}),
	getData: privateProcedure
		.input(
			z.object({
				tournamentId: z.number(),
			}),
		)
		.query(async ({ input }) => await getAllTournamentData(input.tournamentId)),
	getGroups: privateProcedure
		.input(
			z.object({
				tournamentId: z.number(),
			}),
		)
		.query(async ({ input }) => await getTournamentGroups(input.tournamentId)),
	getTeams: privateProcedure
		.input(
			z.object({
				tournamentId: z.number(),
			}),
		)
		.query(async ({ input }) => await getTournamentTeams(input.tournamentId)),
	getMatches: privateProcedure
		.input(
			z.object({
				tournamentId: z.number(),
			}),
		)
		.query(async ({ input }) => await getTournamentMatches(input.tournamentId)),
	getPoints: privateProcedure
		.input(
			z.object({
				tournamentId: z.number(),
			}),
		)
		.query(async ({ input }) => await getTournamentPoints(input.tournamentId)),
});
