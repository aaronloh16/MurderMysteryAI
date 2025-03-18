import { pgTable, text, boolean, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Suspects table
export const suspects = pgTable('suspects', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	role: text('role').notNull(),
	description: text('description').notNull(),
	isGuilty: boolean('is_guilty').notNull(),
	gender: text('gender').notNull(),
});

// Context table (1-to-1 with suspects)
export const contexts = pgTable('contexts', {
	id: serial('id').primaryKey(),
	background: text('background').notNull(),
	personality: text('personality').notNull(),
	alibi: text('alibi').notNull(),
	suspectId: text('suspect_id')
		.notNull()
		.references(() => suspects.id)
		.unique(),
});

// Secrets table (many-to-1 with suspects)
export const secrets = pgTable('secrets', {
	id: serial('id').primaryKey(),
	content: text('content').notNull(),
	suspectId: text('suspect_id')
		.notNull()
		.references(() => suspects.id),
});

// StoryContext table
export const storyContext = pgTable('story_context', {
	id: text('id').primaryKey().default('main'),
	title: text('title').notNull(),
	description: text('description').notNull(),
	location: text('location').notNull(),
	victim: text('victim').notNull(),
	murderWeapon: text('murder_weapon').notNull(),
});

// Define relationships
export const suspectsRelations = relations(suspects, ({ one, many }) => ({
	context: one(contexts, {
		fields: [suspects.id],
		references: [contexts.suspectId],
	}),
	secrets: many(secrets),
}));

export const contextsRelations = relations(contexts, ({ one }) => ({
	suspect: one(suspects, {
		fields: [contexts.suspectId],
		references: [suspects.id],
	}),
}));

export const secretsRelations = relations(secrets, ({ one }) => ({
	suspect: one(suspects, {
		fields: [secrets.suspectId],
		references: [suspects.id],
	}),
}));
