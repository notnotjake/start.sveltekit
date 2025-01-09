import { env } from './app/lib/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: './app/lib/server/db/schema/index.ts',
	out: './db/migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: `file:${env.DB_URL}`
	},
	casing: 'snake_case'
})
