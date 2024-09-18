import { aliasedTable, and, asc, eq, sql } from 'drizzle-orm';
import { db, Players, Scorers, Tournaments, Users } from '../db';

export const getScorers = async (tournamentId: number) => {
	return await db
		.select({
			id: Scorers.id,
			firstName: Scorers.firstName,
			lastName: Scorers.lastName,
			goals: Scorers.goals,
		})
		.from(Scorers)
		.where(eq(Scorers.tournamentId, tournamentId))
		.orderBy(asc(Scorers.id));
};

export const getLockScorers = async (tournamentId: number) => {
	const [lockScorers] = await db.select({ lockScorers: Tournaments.lockScorers }).from(Tournaments).where(eq(Tournaments.id, tournamentId)).limit(1);

	return lockScorers;
};

export const updateScorerGoals = async (scorerId: number, goals: number, increment: boolean) => {
	await db
		.update(Scorers)
		.set({ goals: increment ? goals + 1 : goals - 1 })
		.where(eq(Scorers.id, scorerId));
};

export const updateLockScorers = async (tournamentId: number, lockScorers: boolean) => {
	await db.update(Tournaments).set({ lockScorers }).where(eq(Tournaments.id, tournamentId));
};

export const getPlayerScorers = async (tournamentId: number, userId: string) => {
	const scorerFirst = aliasedTable(Scorers, 'scorer_first');
	const scorerSecond = aliasedTable(Scorers, 'scorer_second');

	const [scorers] = await db
		.select({
			playerId: Players.id,
			firstScorerId: sql<number>`${scorerFirst.id}`,
			firstScorerFirstName: sql<string>`${scorerFirst.firstName}`,
			firstScorerLastName: sql<string>`${scorerFirst.lastName}`,
			firstScorerGoals: sql<number>`${scorerFirst.goals}`,
			secondScorerId: sql<number>`${scorerSecond.id}`,
			secondScorerFirstName: sql<string>`${scorerSecond.firstName}`,
			secondScorerLastName: sql<string>`${scorerSecond.lastName}`,
			secondScorerGoals: sql<number>`${scorerSecond.goals}`,
			lockScorers: sql<boolean>`${Tournaments.lockScorers}`,
		})
		.from(Players)
		.leftJoin(scorerFirst, eq(Players.scorerFirstId, scorerFirst.id))
		.leftJoin(scorerSecond, eq(Players.scorerSecondId, scorerSecond.id))
		.leftJoin(Users, eq(Players.userId, Users.id))
		.leftJoin(Tournaments, eq(Players.tournamentId, Tournaments.id))
		.where(and(eq(Users.id, userId), eq(Tournaments.id, tournamentId)))
		.limit(1);

	return scorers;
};

export const updateScorers = async (
	userId: string,
	tournamentId: number,
	firstScorerFirstName: string,
	firstScorerLastName: string,
	secondScorerFirstName: string,
	secondScorerLastName: string,
) => {
	const firstScorer = await db.query.Scorers.findFirst({
		where: and(eq(Scorers.tournamentId, tournamentId), eq(Scorers.firstName, firstScorerFirstName), eq(Scorers.lastName, firstScorerLastName)),
		columns: { id: true },
	});

	let firstScorerId = firstScorer?.id ?? -1;
	if (!firstScorer) {
		const [scorer] = await db
			.insert(Scorers)
			.values({
				firstName: firstScorerFirstName,
				lastName: firstScorerLastName,
				tournamentId,
			})
			.returning({ id: Scorers.id });
		firstScorerId = scorer.id;
	}

	const secondScorer = await db.query.Scorers.findFirst({
		where: and(eq(Scorers.tournamentId, tournamentId), eq(Scorers.firstName, secondScorerFirstName), eq(Scorers.lastName, secondScorerLastName)),
		columns: { id: true },
	});

	let secondScorerId = secondScorer?.id ?? -1;
	if (!secondScorer) {
		const [scorer] = await db
			.insert(Scorers)
			.values({
				firstName: secondScorerFirstName,
				lastName: secondScorerLastName,
				tournamentId,
			})
			.returning({ id: Scorers.id });
		secondScorerId = scorer.id;
	}

	await db
		.update(Players)
		.set({
			scorerFirstId: firstScorerId,
			scorerSecondId: secondScorerId,
		})
		.where(and(eq(Players.tournamentId, tournamentId), eq(Players.userId, userId)));
};
