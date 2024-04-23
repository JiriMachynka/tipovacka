import { eq } from 'drizzle-orm';
import { db, Users } from '../db';

export const getUserInfo = async (userId: string) => {
	return await db.query.Users.findFirst({
		where: eq(Users.id, userId),
	});
};
