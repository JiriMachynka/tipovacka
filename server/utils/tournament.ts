import { alias } from 'drizzle-orm/pg-core';
import { and, asc, desc, count, eq, isNotNull, or, sql, sum } from 'drizzle-orm';
import { db, Players, Scorers, Teams, TournamentMatchTips, TournamentOverallTips, Tournaments, UserMatchTips, Users } from '../db';

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
		const [tournamentOverallTip] = await db
			.insert(TournamentOverallTips)
			.values({ tournamentId: createdTournament.id })
			.returning({ id: TournamentOverallTips.id });

		await db.insert(Players).values({
			userId: authorId,
			tournamentId: createdTournament.id,
			tournamentOverallTipId: tournamentOverallTip.id,
		});
	} else {
		players.map(async (player) => {
			const [tournamentOverallTip] = await db
				.insert(TournamentOverallTips)
				.values({ tournamentId: createdTournament.id })
				.returning({ id: TournamentOverallTips.id });

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
		.selectDistinct({
			id: Tournaments.id,
			name: Tournaments.name,
		})
		.from(Tournaments)
		.leftJoin(Players, eq(Tournaments.id, Players.tournamentId))
		.where(or(eq(Tournaments.authorId, userId), eq(Players.userId, userId)));

	return allTournaments || [];
};

export const getAllTournamentData = async (tournamentId: number) => {
	const [data] = await db
		.select({
			name: Tournaments.name,
			authorId: Tournaments.authorId,
			numberOfPlayers: count(Players.id),
		})
		.from(Tournaments)
		.leftJoin(Players, eq(Players.tournamentId, Tournaments.id))
		.leftJoin(Users, eq(Players.userId, Users.id))
		.where(eq(Tournaments.id, tournamentId))
		.groupBy(Tournaments.name, Tournaments.authorId);

	if (!data) return null;

	const players = await db
		.select({ username: sql<string>`${Users.username}` }) 
		.from(Players)
		.leftJoin(Users, eq(Players.userId, Users.id))
		.where(eq(Players.tournamentId, tournamentId))
		.orderBy(Players.id);

	const homeTeam = alias(Teams, 'home_team');
	const awayTeam = alias(Teams, 'away_team');

	const userMatches = await db
		.select({
			id: UserMatchTips.playerId,
			homeTeamName: sql<string>`${homeTeam.name}`,
			awayTeamName: sql<string>`${awayTeam.name}`,
			homeScore: UserMatchTips.homeScore,
			awayScore: UserMatchTips.awayScore,
		})
		.from(UserMatchTips)
		.leftJoin(TournamentMatchTips, eq(UserMatchTips.tournamentMatchTipId, TournamentMatchTips.id))
		.leftJoin(Tournaments, eq(TournamentMatchTips.tournamentId, Tournaments.id))
		.leftJoin(homeTeam, eq(TournamentMatchTips.homeTeamId, homeTeam.id))
		.leftJoin(awayTeam, eq(TournamentMatchTips.awayTeamId, awayTeam.id))
		.where(and(eq(TournamentMatchTips.locked, true), eq(TournamentMatchTips.tournamentId, tournamentId)))
		.orderBy(TournamentMatchTips.id, UserMatchTips.playerId);

	return {
		data,
		players,
		userMatches,
	};
};

export const getTournamentPoints = async (tournamentId: number) => {
	const scorerFirst = alias(Scorers, 'scorer_first');
	const scorerSecond = alias(Scorers, 'scorer_second');

	const scorersGoalsSq = db
		.select({
			playerId: Players.id,
			goalsSum: sql<number>`SUM(scorer_first.goals + scorer_second.goals)`.as('goals_sum'),
		})
		.from(Players)
		.leftJoin(scorerFirst, eq(Players.scorerFirstId, scorerFirst.id))
		.leftJoin(scorerSecond, eq(Players.scorerSecondId, scorerSecond.id))
		.groupBy(Players.id)
		.as('scorer_goals_sq');

	return await db
		.select({
			username: Users.username,
			points: sql<number>`${sum(UserMatchTips.points)} + ${scorersGoalsSq.goalsSum}`,
		})
		.from(UserMatchTips)
		.leftJoin(Players, eq(UserMatchTips.playerId, Players.id))
		.leftJoin(Users, eq(Players.userId, Users.id))
		.leftJoin(scorersGoalsSq, eq(Players.id, scorersGoalsSq.playerId))
		.where(and(eq(Players.tournamentId, tournamentId), isNotNull(UserMatchTips.points)))
		.groupBy(Users.username, scorersGoalsSq.goalsSum)
		.orderBy(desc(sql<number>`${sum(UserMatchTips.points)} + ${scorersGoalsSq.goalsSum}`));
};

export const getTournamentGroups = async (tournamentId: number) => {
	return await db.selectDistinct({ name: Teams.groupName }).from(Teams).where(eq(Teams.tournamentId, tournamentId));
};

export const getTournamentTeams = async (tournamentId: number) => {
	return await db
		.select({
			id: Teams.id,
			name: Teams.name,
			groupName: Teams.groupName,
		})
		.from(Teams)
		.where(eq(Teams.tournamentId, tournamentId));
};

export const getTournamentMatches = async (tournamentId: number) => {
	const homeTeam = alias(Teams, 'home_team');
	const awayTeam = alias(Teams, 'away_team');

	return await db
		.select({
			id: TournamentMatchTips.id,
			date: TournamentMatchTips.date,
			group: TournamentMatchTips.group,
			homeTeamId: sql<number>`${homeTeam.id}`,
			homeTeamName: sql<string>`${homeTeam.name}`,
			awayTeamId: sql<number>`${awayTeam.id}`,
			awayTeamName: sql<string>`${awayTeam.name}`,
			homeScore: TournamentMatchTips.homeScore,
			awayScore: TournamentMatchTips.awayScore,
			locked: TournamentMatchTips.locked,
			played: TournamentMatchTips.played,
		})
		.from(TournamentMatchTips)
		.leftJoin(homeTeam, eq(TournamentMatchTips.homeTeamId, homeTeam.id))
		.leftJoin(awayTeam, eq(TournamentMatchTips.awayTeamId, awayTeam.id))
		.where(eq(TournamentMatchTips.tournamentId, tournamentId))
		.orderBy(asc(TournamentMatchTips.date), asc(Teams.groupName));
};

export const updateOverallTip = async (
	tournamentId: number,
	userId: string,
	winnerId: number,
	finalistId: number,
	semifinalistFirstId: number,
	semifinalistSecondId: number,
) => {
	const overallTipId = await getPlayerOverallTipId(tournamentId, userId);

	await db
		.update(TournamentOverallTips)
		.set({
			winnerId,
			finalistId,
			semifinalistFirstId,
			semifinalistSecondId,
		})
		.where(eq(TournamentOverallTips.id, overallTipId));
};
