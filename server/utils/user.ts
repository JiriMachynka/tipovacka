import { and, eq, isNull, ne, or } from 'drizzle-orm';
import { db, Players, Users } from '../db';

export const getUserInfo = async (userId: string) => {
	const [user] = await db.select().from(Users).where(eq(Users.id, userId)).limit(1);

	return user;
};

export const getAllUsers = async (userId: string, tournamentId: number) => {
	return await db
		.select({
			id: Users.id,
			username: Users.username,
			email: Users.email,
		})
		.from(Users)
		.leftJoin(Players, eq(Users.id, Players.userId))
		.where(or(and(ne(Users.id, userId), ne(Players.tournamentId, tournamentId)), isNull(Players.tournamentId)));
};
