import { and, eq, ne, sql } from 'drizzle-orm';
import { db, Players, Tournaments, TournamentMatchTips, TournamentOverallTips, UserMatchTips, Users } from '../db';

export const getPlayers = async (tournamentId: number, authorId: string) => {
	const players = await db
		.select({
			id: Players.id,
			username: sql<string>`${Users.username}`,
			email: sql<string>`${Users.email}`,
		})
		.from(Players)
		.leftJoin(Users, eq(Players.userId, Users.id))
		.where(and(eq(Players.tournamentId, tournamentId), ne(Users.id, authorId)));

	return players;
};

export const addPlayer = async (tournamentId: number, username: string) => {
	const userExists = await db.query.Users.findFirst({
		where: eq(Users.username, username),
		columns: { id: true },
	});

	if (!userExists) return 'Uživatel s tímto uživatelským jménem neexistuje.';

	const [playerReady] = await db
		.select({ id: Players.id })
		.from(Players)
		.leftJoin(Users, eq(Players.userId, Users.id))
		.where(and(eq(Players.tournamentId, tournamentId), eq(Users.username, username)))
		.limit(1);

	if (playerReady?.id) return 'Hráč je již v tipovačce.';

	const [tournamentOverallTip] = await db.insert(TournamentOverallTips).values({ tournamentId }).returning({ id: TournamentOverallTips.id });

	const user = await db.query.Users.findFirst({
		where: eq(Users.username, username),
		columns: { id: true },
	});

	const [player] = await db
		.insert(Players)
		.values({
			userId: user?.id as string,
			tournamentId,
			tournamentOverallTipId: tournamentOverallTip.id,
		})
		.returning({ id: Players.id });

	// Creating matchtips for user
	const matchTips = await db
		.select({ id: TournamentMatchTips.id })
		.from(TournamentMatchTips)
		.where(eq(TournamentMatchTips.tournamentId, tournamentId));

	matchTips.map(async (matchTip) => {
		await db.insert(UserMatchTips).values({
			playerId: player.id,
			tournamentMatchTipId: matchTip.id,
		});
	});
};

export const deletePlayer = async (playerId: number) => {
	const player = await db.query.Players.findFirst({
		where: eq(Players.id, playerId),
		columns: { id: true },
	});

	if (!player) return 'Hráč neexistuje.';

	await db.delete(Players).where(eq(Players.id, playerId));
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