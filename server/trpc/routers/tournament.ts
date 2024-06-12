import { z } from 'zod';
import { privateProcedure, router } from '../trpc';

export const tournamentRouter = router({
	getAll: privateProcedure.query(async ({ ctx }) => await getTournaments(ctx.userId)),
	create: privateProcedure
		.input(
			z.object({
				tournamentName: z.string(),
				teams: z.array(
					z.object({
						name: z.string(),
						code: z.string(),
						group: z.number(),
					}),
				),
				players: z.array(z.string()),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { tournamentName, players, teams } = input;
			return await createTournament(ctx.userId, tournamentName, players, teams);
		}),
	getData: privateProcedure.input(z.object({ tournamentId: z.number() })).query(async ({ input }) => await getAllTournamentData(input.tournamentId)),
	getGroups: privateProcedure.input(z.object({ tournamentId: z.number() })).query(async ({ input }) => await getTournamentGroups(input.tournamentId)),
	getTeams: privateProcedure.input(z.object({ tournamentId: z.number() })).query(async ({ input }) => await getTournamentTeams(input.tournamentId)),
	getMatches: privateProcedure
		.input(z.object({ tournamentId: z.number() }))
		.query(async ({ input }) => await getTournamentMatches(input.tournamentId)),
	getPoints: privateProcedure.input(z.object({ tournamentId: z.number() })).query(async ({ input }) => await getTournamentPoints(input.tournamentId)),
	getUserMatches: privateProcedure
		.input(z.object({ tournamentId: z.number() }))
		.query(async ({ ctx, input }) => await getUserMatches(input.tournamentId, ctx.userId)),
	getPlayerTeams: privateProcedure.input(z.object({ tournamentId: z.number() })).query(async ({ input }) => await getPlayerTeams(input.tournamentId)),
	getOverallTeams: privateProcedure
		.input(z.object({ tournamentId: z.number() }))
		.query(async ({ input }) => await getTournamentOverallTeams(input.tournamentId)),
	getPlayerOverallTips: privateProcedure
		.input(z.object({ tournamentId: z.number() }))
		.query(async ({ ctx, input }) => await getPlayerOverallTips(input.tournamentId, ctx.userId)),
	updateUserMatchTip: privateProcedure
		.input(
			z.object({
				tournamentId: z.number(),
				matchId: z.number(),
				homeScore: z.number(),
				awayScore: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { tournamentId, matchId, homeScore, awayScore } = input;
			await updateUserMatchTip(tournamentId, ctx.userId, matchId, homeScore, awayScore);
		}),
	updateOverallTip: privateProcedure
		.input(
			z.object({
				tournamentId: z.number(),
				winnerId: z.number(),
				finalistId: z.number(),
				semifinalistFirstId: z.number(),
				semifinalistSecondId: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { tournamentId, winnerId, finalistId, semifinalistFirstId, semifinalistSecondId } = input;

			await updateOverallTip(tournamentId, ctx.userId, winnerId, finalistId, semifinalistFirstId, semifinalistSecondId);
		}),
	updateOverallTeams: privateProcedure
		.input(
			z.object({
				tournamentId: z.number(),
				winnerId: z.number(),
				finalistId: z.number(),
				semifinalistFirstId: z.number(),
				semifinalistSecondId: z.number(),
			}),
		)
		.mutation(async ({ input }) => {
			const { tournamentId, winnerId, finalistId, semifinalistFirstId, semifinalistSecondId } = input;

			await updateOverallTeams(tournamentId, winnerId, finalistId, semifinalistFirstId, semifinalistSecondId);
		}),
});
