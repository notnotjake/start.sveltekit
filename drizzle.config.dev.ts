import { env } from './src/lib/utils/env'
import { defineConfig } from 'drizzle-kit'

const url = env.DB_TURSO_SYNC_URL || env.DB_URL

console.log(url)

export default defineConfig({
	schema: './src/lib/server/db/schema/index.ts',
	out: './db/migrations',
	dialect: 'turso',
	dbCredentials: {
		url: url,
		authToken: `${env.DB_TURSO_AUTH}`
	},
	casing: 'snake_case'
})
