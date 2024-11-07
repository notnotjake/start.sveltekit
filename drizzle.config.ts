import { defineConfig } from 'drizzle-kit'

if (!process.env.PRIVATE_DB_URL) throw new Error('DB_URL is not set')

export default defineConfig({
	schema: './app/lib/server/db/schema.ts',
	out: './db/migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: `file:${process.env.PRIVATE_DB_URL}`
	},
	casing: 'snake_case'
})
