import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: "./server/db/schema.ts",
	dialect: "postgresql",
	out: "./supabase/migrations",
	dbCredentials: {
		url: process.env.NUXT_PUBLIC_DATABASE_URL as string,
	}
});
