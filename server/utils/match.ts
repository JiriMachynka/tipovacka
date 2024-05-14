import { and, asc, eq, sql } from 'drizzle-orm';
import { db, Players, Teams, TournamentMatchTips, Tournaments, UserMatchTips } from '../db';
import { alias } from 'drizzle-orm/pg-core';

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

export const deleteMatch = async (matchId: number) => {
	await db.delete(UserMatchTips).where(eq(UserMatchTips.tournamentMatchTipId, matchId));

	await db.delete(TournamentMatchTips).where(eq(TournamentMatchTips.id, matchId));
};

export const editMatch = async (matchId: number, date: Date, group: string, homeTeamId: number, awayTeamId: number) => {
	await db
		.update(TournamentMatchTips)
		.set({
			date,
			group,
			homeTeamId,
			awayTeamId,
		})
		.where(eq(TournamentMatchTips.id, matchId));
};

export const updateMatch = async (matchId: number, locked: boolean) => {
	if (!locked) {
		await db
			.update(TournamentMatchTips)
			.set({
				locked,
				played: false,
				homeScore: 0,
				awayScore: 0,
			})
			.where(eq(TournamentMatchTips.id, matchId));

		await db
			.update(UserMatchTips)
			.set({
				points: 0,
			})
			.where(eq(UserMatchTips.tournamentMatchTipId, matchId));
	}

	await db.update(TournamentMatchTips).set({ locked }).where(eq(TournamentMatchTips.id, matchId));
};

export const finishMatch = async (matchId: number, homeScore: number, awayScore: number) => {
	await db
		.update(TournamentMatchTips)
		.set({
			homeScore,
			awayScore,
			played: true,
		})
		.where(eq(TournamentMatchTips.id, matchId));

	const userMatches = await db
		.select({
			id: UserMatchTips.id,
			userHomeScore: UserMatchTips.homeScore,
			userAwayScore: UserMatchTips.awayScore,
		})
		.from(UserMatchTips)
		.where(eq(UserMatchTips.tournamentMatchTipId, matchId));

	userMatches.map(async (matchTip) => {
		const draw = matchTip.userHomeScore === matchTip.userAwayScore && homeScore === awayScore;
		const homeWin = matchTip.userHomeScore > matchTip.userAwayScore && homeScore > awayScore;
		const awayWin = matchTip.userHomeScore < matchTip.userAwayScore && homeScore < awayScore;

		const exactDraw = matchTip.userHomeScore === homeScore && matchTip.userHomeScore === matchTip.userAwayScore && homeScore === awayScore;

		const exactHomeWin =
			matchTip.userHomeScore === homeScore &&
			matchTip.userAwayScore === awayScore &&
			matchTip.userHomeScore > matchTip.userAwayScore &&
			homeScore > awayScore;

		const exactAwayWin =
			matchTip.userHomeScore === homeScore &&
			matchTip.userAwayScore === awayScore &&
			matchTip.userHomeScore < matchTip.userAwayScore &&
			homeScore < awayScore;

		await db
			.update(UserMatchTips)
			.set({
				points: exactDraw || exactHomeWin || exactAwayWin ? 3 : draw || homeWin || awayWin ? 1 : 0,
			})
			.where(eq(UserMatchTips.id, matchTip.id));
	});
};

export const getUserMatches = async (tournamentId: number, userId: string) => {
	const homeTeam = alias(Teams, 'homeTeam');
	const awayTeam = alias(Teams, 'awayTeam');

	return await db
		.select({
			id: UserMatchTips.id,
			playerId: UserMatchTips.playerId,
			date: sql<Date>`${TournamentMatchTips.date}`,
			group: sql<string>`${TournamentMatchTips.group}`,
			homeTeamName: sql<string>`${homeTeam.name}`,
			awayTeamName: sql<string>`${awayTeam.name}`,
			homeScore: UserMatchTips.homeScore,
			awayScore: UserMatchTips.awayScore,
			points: UserMatchTips.points,
			locked: TournamentMatchTips.locked,
			played: TournamentMatchTips.played,
		})
		.from(UserMatchTips)
		.leftJoin(TournamentMatchTips, eq(UserMatchTips.tournamentMatchTipId, TournamentMatchTips.id))
		.leftJoin(Players, eq(UserMatchTips.playerId, Players.id))
		.leftJoin(homeTeam, eq(TournamentMatchTips.homeTeamId, homeTeam.id))
		.leftJoin(awayTeam, eq(TournamentMatchTips.awayTeamId, awayTeam.id))
		.leftJoin(Tournaments, eq(TournamentMatchTips.tournamentId, Tournaments.id))
		.where(and(eq(Tournaments.id, tournamentId), eq(Players.userId, userId)))
		.orderBy(asc(TournamentMatchTips.date), asc(TournamentMatchTips.group));
};

export const updateUserMatchTip = async (tournamentId: number, userId: string, matchId: number, homeScore: number, awayScore: number) => {
	const playerId = await getPlayerId(tournamentId, userId);

	await db
		.update(UserMatchTips)
		.set({
			homeScore,
			awayScore,
		})
		.where(and(eq(UserMatchTips.id, matchId), eq(UserMatchTips.playerId, playerId)));
};
