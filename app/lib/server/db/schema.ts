import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const userTable = sqliteTable('user', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	identifier: text('identifier').notNull()
})

export const sessionTable = sqliteTable('user_session', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer('expires_at', {
		mode: 'timestamp'
	}).notNull()
})

export const keyTable = sqliteTable('user_key', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	secure_key: text('secure_key')
})
