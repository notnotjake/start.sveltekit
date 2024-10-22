import { blob, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	identifier: text('identifier').notNull()
})

export const session = sqliteTable('user_session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresActive: blob('expires_active', { mode: 'bigint' }).notNull(),
	expiresIdle: blob('expires_idle', { mode: 'bigint' }).notNull()
})

export const key = sqliteTable('user_key', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	secure_key: text('secure_key')
})
