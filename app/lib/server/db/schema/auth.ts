import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	identifier: text('identifier').notNull()
})
export type User = InferSelectModel<typeof user>
export type NewUser = InferInsertModel<typeof user>

export const session = sqliteTable('user_session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	invalidatedAt: integer('invalidated_at', { mode: 'timestamp' })
})
export type Session = InferSelectModel<typeof session>
export type NewSession = InferInsertModel<typeof session>

export const key = sqliteTable('user_key', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id),
	secure_key: text('secure_key')
})
