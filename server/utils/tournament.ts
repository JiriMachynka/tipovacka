import { eq, or } from 'drizzle-orm';
import { db, Players, Teams, TournamentOverallTips, Tournaments, Users } from '../db';

export const createTournament = async (authorId: string, name: string, players: string[], teams: string[][]) => {
	const [createdTournament] = await db
		.insert(Tournaments)
		.values({
			name,
			authorId,
		})
		.returning({ id: Tournaments.id });

	await db.insert(Teams).values(
		teams
			.map((group, idx) =>
				group.map((team) => {
					return {
						name: team,
						groupName: `Skupina ${String.fromCharCode(65 + idx)}`,
						tournamentId: createdTournament.id,
					};
				}),
			)
			.flatMap((group) => group),
	);

	if (players.length === 0) {
		const [tournamentOverallTip] = await db.insert(TournamentOverallTips).values({ tournamentId: createdTournament.id }).returning({ id: TournamentOverallTips.id });

		await db.insert(Players).values({
			userId: authorId,
			tournamentId: createdTournament.id,
			tournamentOverallTipId: tournamentOverallTip.id,
		});
	} else {
		players.map(async (player) => {
			const [tournamentOverallTip] = await db.insert(TournamentOverallTips).values({ tournamentId: createdTournament.id }).returning({ id: TournamentOverallTips.id });

			const [playerRecord] = await db
				.select({
					id: Users.id,
				})
				.from(Users)
				.where(eq(Users.username, player))
				.limit(1);

			await db.insert(Players).values({
				userId: playerRecord.id,
				tournamentId: createdTournament.id,
				tournamentOverallTipId: tournamentOverallTip.id,
			});
		});
	}
	return createdTournament.id;
};

export const getTournaments = async (userId: string) => {
	const allTournaments = await db
		.select({
			id: Tournaments.id,
			name: Tournaments.name,
		})
		.from(Tournaments)
		.leftJoin(Players, eq(Tournaments.id, Players.tournamentId))
		.where(or(eq(Tournaments.authorId, userId), eq(Players.userId, userId)));

	return allTournaments || [];
};
