import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'

export const userTable = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	identifier: text('identifier').notNull()
})
export type User = InferSelectModel<typeof userTable>
export type NewUser = InferInsertModel<typeof userTable>

export const sessionTable = sqliteTable('user_session', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer('expires_at', {
		mode: 'timestamp'
	}).notNull()
})
export type Session = InferSelectModel<typeof sessionTable>
export type NewSession = InferInsertModel<typeof sessionTable>

export const keyTable = sqliteTable('user_key', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	secure_key: text('secure_key')
})
