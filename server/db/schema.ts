import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const Users = pgTable('users', {
	id: uuid('id').primaryKey(),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
});

export const Tournaments = pgTable('tournaments', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	authorId: uuid('author_id')
		.notNull()
		.references(() => Users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	lockScorers: boolean('lock_scorers').notNull().default(false),
	winnerId: integer('winner_id').references(() => Teams.id, { onDelete: 'set null', onUpdate: 'cascade' }),
	finalistId: integer('finalist_id').references(() => Teams.id, { onDelete: 'set null', onUpdate: 'cascade' }),
	semifinalistFirstId: integer('semifinalist_first_id').references(() => Teams.id, { onDelete: 'set null', onUpdate: 'cascade' }),
	semifinalistSecondId: integer('semifinalist_second_id').references(() => Teams.id, { onDelete: 'set null', onUpdate: 'cascade' }),
});

export const tournamentRelations = relations(Tournaments, ({ one }) => ({
	author: one(Users, {
		fields: [Tournaments.authorId],
		references: [Users.id],
	}),
	winner: one(Teams, {
		fields: [Tournaments.winnerId],
		references: [Teams.id],
	}),
	finalist: one(Teams, {
		fields: [Tournaments.finalistId],
		references: [Teams.id],
	}),
	semifinalistFirst: one(Teams, {
		fields: [Tournaments.semifinalistFirstId],
		references: [Teams.id],
	}),
	semifinalistSecond: one(Teams, {
		fields: [Tournaments.semifinalistSecondId],
		references: [Teams.id],
	}),
}));

export const Players = pgTable('players', {
	id: serial('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => Users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	tournamentId: integer('tournament_id')
		.notNull()
		.references(() => Tournaments.id, { onDelete: 'cascade' }),
	tournamentOverallTipId: integer('tournament_overall_tip_id')
		.notNull()
		.references(() => TournamentOverallTips.id, { onDelete: 'cascade' }),
	scorerFirstId: integer('scorer_first_id').references(() => Scorers.id),
	scorerSecondId: integer('scorer_second_id').references(() => Scorers.id),
});

export const playerRelations = relations(Players, ({ one }) => ({
	tournament: one(Tournaments, {
		fields: [Players.tournamentId],
		references: [Tournaments.id],
	}),
	tournamentOverallTip: one(TournamentOverallTips, {
		fields: [Players.tournamentOverallTipId],
		references: [TournamentOverallTips.id],
	}),
	scorerFirst: one(Scorers, {
		fields: [Players.scorerFirstId],
		references: [Scorers.id],
	}),
	scorerSecond: one(Scorers, {
		fields: [Players.scorerSecondId],
		references: [Scorers.id],
	}),
}));

export const Teams = pgTable('teams', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	groupName: text('group_name').notNull(),
	tournamentId: integer('tournament_id')
		.notNull()
		.references(() => Tournaments.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
});

export const teamsRelations = relations(Teams, ({ one }) => ({
	tournaments: one(Tournaments, {
		fields: [Teams.tournamentId],
		references: [Tournaments.id],
	}),
}));

export const TournamentOverallTips = pgTable('tournament_overall_tips', {
	id: serial('id').primaryKey(),
	tournamentId: integer('tournament_id')
		.notNull()
		.references(() => Tournaments.id, { onDelete: 'cascade' }),
	winnerId: integer('winner_id').references(() => Teams.id, { onDelete: 'set null' }),
	finalistId: integer('finalist_id').references(() => Teams.id, { onDelete: 'set null' }),
	semifinalistFirstId: integer('semifinalist_first_id').references(() => Teams.id, { onDelete: 'set null' }),
	semifinalistSecondId: integer('semifinalist_second_id').references(() => Teams.id, { onDelete: 'set null' }),
});

export const tournamentOverallTipsRelations = relations(TournamentOverallTips, ({ one }) => ({
	tournaments: one(Tournaments, {
		fields: [TournamentOverallTips.tournamentId],
		references: [Tournaments.id],
	}),
	winner: one(Teams, {
		fields: [TournamentOverallTips.winnerId],
		references: [Teams.id],
	}),
	finalist: one(Teams, {
		fields: [TournamentOverallTips.finalistId],
		references: [Teams.id],
	}),
	semifinalistFirst: one(Teams, {
		fields: [TournamentOverallTips.semifinalistFirstId],
		references: [Teams.id],
	}),
	semifinalistSecond: one(Teams, {
		fields: [TournamentOverallTips.semifinalistSecondId],
		references: [Teams.id],
	}),
}));

export const UserMatchTips = pgTable('user_match_tips', {
	id: serial('id').primaryKey(),
	playerId: integer('player_id')
		.notNull()
		.references(() => Players.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	tournamentMatchTipId: integer('tournament_match_tip_id')
		.notNull()
		.references(() => TournamentMatchTips.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	homeScore: integer('home_score').default(0).notNull(),
	awayScore: integer('away_score').default(0).notNull(),
	points: integer('points'),
});

export const userMatchTipsRelations = relations(UserMatchTips, ({ one }) => ({
	players: one(Players, {
		fields: [UserMatchTips.playerId],
		references: [Players.id],
	}),
	tournamentMatchTips: one(TournamentMatchTips, {
		fields: [UserMatchTips.tournamentMatchTipId],
		references: [TournamentMatchTips.id],
	}),
}));

export const TournamentMatchTips = pgTable('tournament_match_tips', {
	id: serial('id').primaryKey(),
	date: timestamp('date').notNull(),
	tournamentId: integer('tournament_id')
		.notNull()
		.references(() => Tournaments.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	group: text('group').notNull(),
	homeTeamId: integer('home_team_id')
		.notNull()
		.references(() => Teams.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	awayTeamId: integer('away_team_id')
		.notNull()
		.references(() => Teams.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	homeScore: integer('home_score').default(0).notNull(),
	awayScore: integer('away_score').default(0).notNull(),
	played: boolean('played').default(false).notNull(),
	locked: boolean('locked').default(false).notNull(),
});

export const tournamentMatchTipsRelations = relations(TournamentMatchTips, ({ one }) => ({
	tournaments: one(Tournaments, {
		fields: [TournamentMatchTips.tournamentId],
		references: [Tournaments.id],
	}),
	homeTeam: one(Teams, {
		fields: [TournamentMatchTips.homeTeamId],
		references: [Teams.id],
	}),
	awayTeam: one(Teams, {
		fields: [TournamentMatchTips.awayTeamId],
		references: [Teams.id],
	}),
}));

export const Scorers = pgTable('scorers', {
	id: serial('id').primaryKey(),
	tournamentId: integer('tournament_id')
		.notNull()
		.references(() => Tournaments.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	goals: integer('goals').notNull().default(0),
	assists: integer('assists').notNull().default(0),
});

export const scorersRelations = relations(Scorers, ({ one }) => ({
	tournaments: one(Tournaments, {
		fields: [Scorers.tournamentId],
		references: [Tournaments.id],
	}),
}));
