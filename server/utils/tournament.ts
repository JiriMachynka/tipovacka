import type { Country } from '@/types';
import { and, asc, desc, count, eq, isNotNull, or, sql, sum, aliasedTable } from 'drizzle-orm';
import { db, Players, Scorers, Teams, TournamentMatchTips, TournamentOverallTips, Tournaments, UserMatchTips, Users } from '../db';

export const getOwnerEmail = async (tournamentId: number) => {
	const [owner] = await db
		.select({
			email: Users.email,
		})
		.from(Users)
		.leftJoin(Tournaments, eq(Users.id, Tournaments.authorId))
		.where(eq(Tournaments.id, tournamentId))
		.limit(1);

	return owner;
};

export const getPlayerData = async (userId: string, tournamentId: number) => {
	const [player] = await db
		.select({
			id: Players.id,
			username: Users.username,
			email: Users.email,
		})
		.from(Users)
		.leftJoin(Players, eq(Users.id, Players.userId))
		.leftJoin(Tournaments, eq(Players.tournamentId, Tournaments.id))
		.where(and(eq(Tournaments.id, tournamentId), eq(Users.id, userId)))
		.limit(1);

	return player;
};

export const createTournament = async (authorId: string, name: string, players: string[], teams: Country[]) => {
	const [createdTournament] = await db
		.insert(Tournaments)
		.values({
			name,
			authorId,
		})
		.returning({ id: Tournaments.id });

	await db.insert(Teams).values(
		teams.map((team) => {
			return {
				name: team.name,
				groupName: `Skupina ${String.fromCharCode(65 + team.group)}`,
				tournamentId: createdTournament.id,
			};
		}),
	);

	const [tournamentOverallTip] = await db
		.insert(TournamentOverallTips)
		.values({ tournamentId: createdTournament.id })
		.returning({ id: TournamentOverallTips.id });

	if (players.length === 0) {
		await db.insert(Players).values({
			userId: authorId,
			tournamentId: createdTournament.id,
			tournamentOverallTipId: tournamentOverallTip.id,
		});
	} else {
		players.map(async (player) => {
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
		.where(or(eq(Tournaments.authorId, userId), eq(Players.userId, userId)))
		.orderBy(desc(Tournaments.id));

	return allTournaments || [];
};

export const getAllTournamentData = async (userId: string, tournamentId: number) => {
	const playersCountTable = db
		.select({
			tournamentId: Players.tournamentId,
			numberOfPlayers: count(Players.id).as('numberOfPlayers'),
		})
		.from(Players)
		.where(eq(Players.tournamentId, tournamentId))
		.groupBy(Players.tournamentId)
		.as('players_count');

	const matchCountTable = db
		.select({
			tournamentId: TournamentMatchTips.tournamentId,
			numberOfMatches: count(TournamentMatchTips.id).as('numberOfMatches'),
		})
		.from(TournamentMatchTips)
		.where(and(eq(TournamentMatchTips.locked, true), eq(TournamentMatchTips.tournamentId, tournamentId)))
		.groupBy(TournamentMatchTips.tournamentId)
		.as('match_count');

	const [data] = await db
		.select({
			name: sql<string>`${Tournaments.name}`,
			isAuthor: sql<boolean>`CASE WHEN ${Tournaments.authorId} = ${userId} THEN true ELSE false END`,
			numberOfPlayers: playersCountTable.numberOfPlayers,
			numberOfMatches: matchCountTable.numberOfMatches,
		})
		.from(Tournaments)
		.leftJoin(playersCountTable, eq(Tournaments.id, playersCountTable.tournamentId))
		.leftJoin(matchCountTable, eq(Tournaments.id, matchCountTable.tournamentId))
		.where(eq(Tournaments.id, tournamentId));

	const scorerFirst = aliasedTable(Scorers, 'scorer_first');
	const scorerSecond = aliasedTable(Scorers, 'scorer_second');

	const playersPromise = db
		.select({
			id: Players.id,
			username: sql<string>`${Users.username}`,
			scorerFirstName: sql<string>`CONCAT(${scorerFirst.firstName}, ' ', ${scorerFirst.lastName})`,
			scorerSecondName: sql<string>`CONCAT(${scorerSecond.firstName}, ' ', ${scorerSecond.lastName})`,
		})
		.from(Players)
		.leftJoin(scorerFirst, eq(Players.scorerFirstId, scorerFirst.id))
		.leftJoin(scorerSecond, eq(Players.scorerSecondId, scorerSecond.id))
		.leftJoin(Users, eq(Players.userId, Users.id))
		.where(eq(Players.tournamentId, tournamentId))
		.orderBy(Players.id);

	const homeTeam = aliasedTable(Teams, 'home_team');
	const awayTeam = aliasedTable(Teams, 'away_team');

	const userMatchesPromise = db
		.select({
			id: UserMatchTips.id,
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
		.where(and(eq(TournamentMatchTips.locked, true), eq(TournamentMatchTips.tournamentId, tournamentId), isNotNull(UserMatchTips.points)))
		.orderBy(UserMatchTips.playerId, TournamentMatchTips.id);

	const [players, userMatches] = await Promise.all([playersPromise, userMatchesPromise]);

	return {
		data,
		players,
		userMatches,
	};
};

export const getTournamentPoints = async (tournamentId: number, userId: string) => {
	const teamsPoints = sql<string>`
		CASE
			WHEN ${TournamentOverallTips.winnerId} = ${Tournaments.winnerId} THEN 6 
			WHEN ${TournamentOverallTips.winnerId} = ${Tournaments.finalistId} THEN 2
			WHEN ${TournamentOverallTips.winnerId} IN (${Tournaments.semifinalistFirstId}, ${Tournaments.semifinalistSecondId}) THEN 1
			ELSE 0
		END + CASE
			WHEN ${TournamentOverallTips.finalistId} = ${Tournaments.finalistId} THEN 2
			WHEN ${TournamentOverallTips.finalistId} IN (${Tournaments.semifinalistFirstId}, ${Tournaments.semifinalistSecondId}) THEN 1
			ELSE 0
		END + CASE
			WHEN ${TournamentOverallTips.semifinalistFirstId} IN (${Tournaments.semifinalistFirstId}, ${Tournaments.semifinalistSecondId}) THEN 1
			ELSE 0
		END + CASE
			WHEN ${TournamentOverallTips.semifinalistSecondId} IN (${Tournaments.semifinalistFirstId}, ${Tournaments.semifinalistSecondId}) THEN 1
			ELSE 0
		END`.as('teams_points');

	const scorerFirst = aliasedTable(Scorers, 'scorer_first');
	const scorerSecond = aliasedTable(Scorers, 'scorer_second');

	const scorersGoalsSq = db
		.select({
			playerId: Players.id,
			goalsSum: sql<number>`SUM(${scorerFirst.goals}+${scorerSecond.goals})`.as('goals_sum'),
		})
		.from(Players)
		.leftJoin(scorerFirst, eq(Players.scorerFirstId, scorerFirst.id))
		.leftJoin(scorerSecond, eq(Players.scorerSecondId, scorerSecond.id))
		.groupBy(Players.id)
		.as('scorer_goals_sq');

	return await db
		.select({
			highlight: sql<boolean>`CASE WHEN ${Users.id} = ${userId} THEN true ELSE false END`,
			username: sql<string>`${Users.username}`,
			points: sql<number>`${sum(UserMatchTips.points)} + COALESCE(${scorersGoalsSq.goalsSum}, 0) + ${teamsPoints.sql}`,
		})
		.from(UserMatchTips)
		.leftJoin(Players, eq(UserMatchTips.playerId, Players.id))
		.leftJoin(Users, eq(Players.userId, Users.id))
		.leftJoin(TournamentOverallTips, eq(Players.tournamentOverallTipId, TournamentOverallTips.id))
		.leftJoin(Tournaments, eq(Players.tournamentId, Tournaments.id))
		.leftJoin(scorersGoalsSq, eq(Players.id, scorersGoalsSq.playerId))
		.where(and(eq(Players.tournamentId, tournamentId), isNotNull(UserMatchTips.points)))
		.groupBy(
			Users.id,
			Users.username,
			scorersGoalsSq.goalsSum,
			TournamentOverallTips.winnerId,
			TournamentOverallTips.finalistId,
			TournamentOverallTips.semifinalistFirstId,
			TournamentOverallTips.semifinalistSecondId,
			Tournaments.winnerId,
			Tournaments.finalistId,
			Tournaments.semifinalistFirstId,
			Tournaments.semifinalistSecondId,
			teamsPoints.sql,
		)
		.orderBy(desc(sql<number>`${sum(UserMatchTips.points)} + COALESCE(${scorersGoalsSq.goalsSum}, 0) + ${teamsPoints.sql}`));
};

export const getTournamentGroups = async (tournamentId: number) => {
	return await db
		.selectDistinct({ name: sql<string>`${Teams.groupName}` })
		.from(Teams)
		.where(eq(Teams.tournamentId, tournamentId));
};

export const getTournamentTeams = async (tournamentId: number) => {
	return await db
		.select({
			id: sql<number>`${Teams.id}`,
			name: sql<string>`${Teams.name}`,
			groupName: sql<string>`${Teams.groupName}`,
		})
		.from(Teams)
		.where(eq(Teams.tournamentId, tournamentId))
		.orderBy(Teams.name);
};

export const getPlayerTeams = async (tournamentId: number) => {
	const winner = aliasedTable(Teams, 'winner');
	const finalist = aliasedTable(Teams, 'finalist');
	const semifinalistFirst = aliasedTable(Teams, 'semifinalist_first');
	const semifinalistSecond = aliasedTable(Teams, 'semifinalist_second');

	return await db
		.select({
			username: sql<string>`${Users.username}`,
			winner: sql<string>`${winner.name}`,
			finalist: sql<string>`${finalist.name}`,
			semifinalistFirst: sql<string>`${semifinalistFirst.name}`,
			semifinalistSecond: sql<string>`${semifinalistSecond.name}`,
		})
		.from(Players)
		.leftJoin(TournamentOverallTips, eq(Players.tournamentOverallTipId, TournamentOverallTips.id))
		.leftJoin(winner, eq(TournamentOverallTips.winnerId, winner.id))
		.leftJoin(finalist, eq(TournamentOverallTips.finalistId, finalist.id))
		.leftJoin(semifinalistFirst, eq(TournamentOverallTips.semifinalistFirstId, semifinalistFirst.id))
		.leftJoin(semifinalistSecond, eq(TournamentOverallTips.semifinalistSecondId, semifinalistSecond.id))
		.leftJoin(Users, eq(Players.userId, Users.id))
		.where(eq(Players.tournamentId, tournamentId))
		.orderBy(Users.username);
};

export const getTournamentMatches = async (tournamentId: number) => {
	const homeTeam = aliasedTable(Teams, 'home_team');
	const awayTeam = aliasedTable(Teams, 'away_team');

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
		.orderBy(asc(TournamentMatchTips.id));
};

export const getTournamentOverallTeams = async (tournamentId: number) => {
	const [teams] = await db
		.select({
			winnerId: Tournaments.winnerId,
			finalistId: Tournaments.finalistId,
			semifinalistFirstId: Tournaments.semifinalistFirstId,
			semifinalistSecondId: Tournaments.semifinalistSecondId,
		})
		.from(Tournaments)
		.where(eq(Tournaments.id, tournamentId))
		.limit(1);

	return teams;
};

export const updateOverallTip = async (
	tournamentId: number,
	userId: string,
	winnerId: number | null,
	finalistId: number | null,
	semifinalistFirstId: number | null,
	semifinalistSecondId: number | null,
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

export const updateOverallTeams = async (
	tournamentId: number,
	winnerId: number,
	finalistId: number,
	semifinalistFirstId: number,
	semifinalistSecondId: number,
) => {
	await db
		.update(Tournaments)
		.set({
			winnerId,
			finalistId,
			semifinalistFirstId,
			semifinalistSecondId,
		})
		.where(eq(Tournaments.id, tournamentId));
};
