import { eq } from 'drizzle-orm';
import { db, Players, TournamentMatchTips, UserMatchTips } from '../db';

export const createMatch = async (tournamentId: number, date: Date, group: string, homeTeamId: number, awayTeamId: number) => {
	const [createdMatch] = await db
		.insert(TournamentMatchTips)
		.values({
			tournamentId,
			date,
			group,
			homeTeamId,
			awayTeamId,
		})
		.returning({ id: TournamentMatchTips.id });

	const players = await db
		.select({
			id: Players.id,
		})
		.from(Players)
		.where(eq(Players.tournamentId, tournamentId));

	players.map(async (player) => {
		await db.insert(UserMatchTips).values({
			tournamentMatchTipId: createdMatch.id,
			playerId: player.id,
		});
	});

	return createdMatch.id;
};
