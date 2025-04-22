import { env } from '$env/dynamic/private'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'

const sqlite = new Database(env.DB_URL || './db/dev.db')

sqlite.exec('PRAGMA journal_mode = WAL;') // Better performance
sqlite.exec('PRAGMA foreign_keys = ON;') // Enable foreign key constraints
sqlite.exec('PRAGMA synchronous = NORMAL;') // Good balance of safety and speed
sqlite.exec('PRAGMA busy_timeout = 5000;') // Timeout after 5s

export const db = drizzle({
	client: sqlite,
	schema: schema,
	logger: false
})
