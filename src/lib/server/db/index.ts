import { env } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

const isLocalDevelopment = publicEnv.PUBLIC_NODE_ENV === 'development'

const connection = isLocalDevelopment
	? {
			url: 'file:./db/dev.db'
		}
	: {
			url: env.DB_TURSO_URL || 'file:./db/dev.db',
			authToken: env.DB_TURSO_AUTH || ''
		}

const turso = createClient(connection)

if (isLocalDevelopment) {
	turso.execute('PRAGMA journal_mode = WAL;') // Better performance
	turso.execute('PRAGMA foreign_keys = ON;') // Enable foreign key constraints
	turso.execute('PRAGMA synchronous = NORMAL;') // Good balance of safety and speed
	turso.execute('PRAGMA busy_timeout = 5000;') // Timeout after 5s
}

export const db = drizzle({
	client: turso,
	schema: schema,
	logger: false
})
