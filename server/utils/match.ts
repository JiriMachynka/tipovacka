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
