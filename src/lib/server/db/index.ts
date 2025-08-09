import { env } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

const connection = () => {
	switch (publicEnv.PUBLIC_NODE_ENV) {
		case 'development':
			return { url: 'file:./db/dev.deb' }
		case 'production':
			return {
				url: env.DB_TURSO_URL || '',
				authToken: env.DB_TURSO_AUTH || ''
			}
		default:
			console.log('Could not determine environment. Using development database connection.')
			return { url: 'file:./db/dev.deb' }
	}
}

const turso = createClient(connection())

if (publicEnv.PUBLIC_NODE_ENV === 'development') {
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
