import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

const {
	public: { databaseUrl },
} = useRuntimeConfig();

export const pool = new pg.Pool({ connectionString: databaseUrl });

await pool.connect();
export const db = drizzle(pool, { schema });
