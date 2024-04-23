import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: "./server/db/schema.ts",
	driver: "pg",
	out: "./supabase/migrations",
	dbCredentials: {
		connectionString: process.env.NUXT_PUBLIC_DATABASE_URL!,
	}
});
