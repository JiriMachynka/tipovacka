ALTER TABLE "tournaments" ADD COLUMN "winner_id" integer;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "finalist_id" integer;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "semifinalist_first_id" integer;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "semifinalist_second_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_winner_id_teams_id_fk" FOREIGN KEY ("winner_id") REFERENCES "teams"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_finalist_id_teams_id_fk" FOREIGN KEY ("finalist_id") REFERENCES "teams"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_semifinalist_first_id_teams_id_fk" FOREIGN KEY ("semifinalist_first_id") REFERENCES "teams"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_semifinalist_second_id_teams_id_fk" FOREIGN KEY ("semifinalist_second_id") REFERENCES "teams"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
