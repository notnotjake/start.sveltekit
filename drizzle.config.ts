import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'
config()

const isLocalDevelopment = process.env.PUBLIC_NODE_ENV === 'development'
console.log('isLocalDevelopment', isLocalDevelopment)

export default defineConfig({
	schema: './src/lib/server/db/schema/index.ts',
	out: './db/migrations',
	dialect: isLocalDevelopment ? 'sqlite' : 'turso',
	dbCredentials: isLocalDevelopment
		? { url: './db/dev.db' }
		: {
				url: process.env.DB_TURSO_URL || 'file:./db/dev.db',
				authToken: process.env.DB_TURSO_AUTH || ''
			},
	casing: 'snake_case'
})
