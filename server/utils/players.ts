import { aliasedTable, and, desc, eq, isNotNull, ne, sql } from 'drizzle-orm';
import { db, Players, Tournaments, TournamentMatchTips, TournamentOverallTips, UserMatchTips, Users, Teams } from '../db';

export const getTournamentPlayers = async (tournamentId: number, authorId: string) => {
	return await db
		.select({
			id: Players.id,
			username: sql<string>`${Users.username}`,
			email: sql<string>`${Users.email}`,
		})
		.from(Players)
		.leftJoin(Users, eq(Players.userId, Users.id))
		.where(and(eq(Players.tournamentId, tournamentId), ne(Users.id, authorId)));
};

export const addPlayer = async (tournamentId: number, username: string) => {
	const [tournamentOverallTip] = await db.insert(TournamentOverallTips).values({ tournamentId }).returning({ id: TournamentOverallTips.id });

	const user = await db.query.Users.findFirst({
		where: (users, { eq }) => eq(users.username, username),
		columns: { id: true },
	});

	if (!user) return 'Uživatel neexistuje.';

	const [player] = await db
		.insert(Players)
		.values({
			userId: user.id,
			tournamentId,
			tournamentOverallTipId: tournamentOverallTip.id,
		})
		.returning({ id: Players.id });

	// Creating matchtips for user
	const matchTips = await db.query.TournamentMatchTips.findMany({
		where: (TournamentMatchTips, { eq }) => eq(TournamentMatchTips.tournamentId, tournamentId),
		orderBy: (TournamentMatchTips, { asc }) => asc(TournamentMatchTips.id),
		columns: { id: true },
	});

	const matchTipsPromise = matchTips.map((matchTip) => {
		return db.insert(UserMatchTips).values({
			playerId: player.id,
			tournamentMatchTipId: matchTip.id,
		});
	});

	await Promise.all(matchTipsPromise);
};

export const deletePlayer = async (playerId: number) => {
	const player = await db.query.Players.findFirst({
		where: eq(Players.id, playerId),
		columns: { id: true },
	});

	if (!player) return 'Hráč neexistuje.';

	const [deletedPlayer] = await db
		.delete(Players)
		.where(eq(Players.id, playerId))
		.returning({ tournamentOverallTipId: Players.tournamentOverallTipId });

	await db.delete(TournamentOverallTips).where(eq(TournamentOverallTips.id, deletedPlayer.tournamentOverallTipId));
};

export const getPlayerId = async (tournamentId: number, userId: string) => {
	const [player] = await db
		.select({ id: Players.id })
		.from(Players)
		.where(and(eq(Players.userId, userId), eq(Players.tournamentId, tournamentId)))
		.limit(1);

	return player.id;
};

export const getPlayerOverallTips = async (tournamentId: number, userId: string) => {
	const overallTipId = await getPlayerOverallTipId(tournamentId, userId);

	const [overallTip] = await db
		.select({
			id: TournamentOverallTips.id,
			winnerId: TournamentOverallTips.winnerId,
			finalistId: TournamentOverallTips.finalistId,
			semifinalistFirstId: TournamentOverallTips.semifinalistFirstId,
			semifinalistSecondId: TournamentOverallTips.semifinalistSecondId,
			lockScorers: Tournaments.lockScorers,
		})
		.from(TournamentOverallTips)
		.leftJoin(Tournaments, eq(TournamentOverallTips.tournamentId, Tournaments.id))
		.where(eq(TournamentOverallTips.id, overallTipId))
		.limit(1);

	return overallTip;
};

export const getPlayerOverallTipId = async (tournamentId: number, userId: string) => {
	const [player] = await db
		.select({ overallTipId: Players.id })
		.from(Players)
		.where(and(eq(Players.userId, userId), eq(Players.tournamentId, tournamentId)))
		.limit(1);

	return player.overallTipId;
};

export const getPlayerMatchTips = async (playerId: number) => {
	const homeTeam = aliasedTable(Teams, 'homeTeam');
	const awayTeam = aliasedTable(Teams, 'awayTeam');

	return await db
		.select({
			id: UserMatchTips.id,
			homeTeamName: sql<string>`${homeTeam.name}`,
			awayTeamName: sql<string>`${awayTeam.name}`,
			homeScore: UserMatchTips.homeScore,
			awayScore: UserMatchTips.awayScore,
		})
		.from(UserMatchTips)
		.leftJoin(TournamentMatchTips, eq(UserMatchTips.tournamentMatchTipId, TournamentMatchTips.id))
		.leftJoin(homeTeam, eq(TournamentMatchTips.homeTeamId, homeTeam.id))
		.leftJoin(awayTeam, eq(TournamentMatchTips.awayTeamId, awayTeam.id))
		.leftJoin(Players, eq(UserMatchTips.playerId, Players.id))
		.where(and(eq(TournamentMatchTips.locked, true), eq(Players.id, playerId), isNotNull(UserMatchTips.points)))
		.orderBy(desc(TournamentMatchTips.id));
};
