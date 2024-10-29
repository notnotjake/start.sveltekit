import Database from 'better-sqlite3'
import type { InferSelectModel } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import { env } from '$env/dynamic/private'

import * as schema from './schema'

if (!env.DB_URL) throw new Error('DB_URL is not set')
const sqlite = new Database(env.DB_URL || './db/dev.db')

sqlite.exec('PRAGMA journal_mode = WAL;') // Better performance
sqlite.exec('PRAGMA foreign_keys = ON;') // Enable foreign key constraints
sqlite.exec('PRAGMA synchronous = NORMAL;') // Good balance of safety and speed
sqlite.exec('PRAGMA busy_timeout = 5000;') // Timeout after 5s

export const db = drizzle({
	client: sqlite,
	schema: schema,
	logger: true
})

// Database Types
export type User = InferSelectModel<typeof schema.userTable>
export type Session = InferSelectModel<typeof schema.sessionTable>
