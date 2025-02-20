import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	identifier: text('identifier').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	lastSeenAt: integer('last_seen_at', { mode: 'timestamp' }).notNull()
})
export type User = InferSelectModel<typeof user>
export type NewUser = InferInsertModel<typeof user>

export const key = sqliteTable('user_key', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	type: text('type').notNull(),
	credential: text('credential'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(new Date())
})
export type Key = InferSelectModel<typeof key>
export type NewKey = InferInsertModel<typeof key>

export const authAttempt = sqliteTable('auth_attempt', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	sessionId: text('session_id').references(() => session.id),
	type: text('type').notNull(),
	credential: text('credential'),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
})
export type AuthAttempt = InferSelectModel<typeof authAttempt>
export type NewAuthAttempt = InferInsertModel<typeof authAttempt>

export const session = sqliteTable('user_session', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => user.id),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	invalidatedAt: integer('invalidated_at', { mode: 'timestamp' })
})
export type Session = InferSelectModel<typeof session>
export type NewSession = InferInsertModel<typeof session>
