import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

import * as schema from './schema'

export const turso = createClient({
	url: process.env.DB_URL || 'file:./db/replica.db',
	authToken: process.env.DB_TURSO_AUTH,
	syncUrl: process.env.DB_TURSO_SYNC_URL,
	syncInterval: 60
})

export const db = drizzle({
	client: turso,
	schema: schema,
	logger: false
})
