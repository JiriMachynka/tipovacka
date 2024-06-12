import { eq, ne } from 'drizzle-orm';
import { db, Users } from '../db';

export const getUserInfo = async (userId: string) => {
	const [user] = await db.select().from(Users).where(eq(Users.id, userId)).limit(1);

	return user;
};

export const getAllUsers = async (userId: string) => {
	return await db
		.select({
			id: Users.id,
			username: Users.username,
			email: Users.email,
		})
		.from(Users)
		.where(ne(Users.id, userId));
};
