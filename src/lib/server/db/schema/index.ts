import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name'),
	identifier: text('identifier').notNull().unique(),
	lastSeenAt: integer('last_seen_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})
export type User = InferSelectModel<typeof user>
export type NewUser = InferInsertModel<typeof user>
