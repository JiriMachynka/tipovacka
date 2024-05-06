import { eq, ne } from 'drizzle-orm';
import { db, Users } from '../db';

export const getUserInfo = async (userId: string) => {
	return await db.query.Users.findFirst({
		where: eq(Users.id, userId),
	});
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
