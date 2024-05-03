import { asc, eq } from 'drizzle-orm';
import { db, Scorers, Tournaments } from '../db';

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
	const [lockScorers] = await db
		.select({ lockScorers: Tournaments.lockScorers })
		.from(Tournaments)
		.where(eq(Tournaments.id, tournamentId))
		.limit(1);

	return lockScorers;
};

export const updateScorerGoals = async (scorerId: number, goals: number, increment: boolean) => {
	await db
		.update(Scorers)
		.set({ goals: increment ? goals + 1 : goals - 1 })
		.where(eq(Scorers.id, scorerId));
};

export const updateLockScorers = async (tournamentId: number, lockScorers: boolean) => {
	await db
		.update(Tournaments)
		.set({ lockScorers })
		.where(eq(Tournaments.id, tournamentId));
};
