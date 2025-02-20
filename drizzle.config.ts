import { env } from './src/lib/utils/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: './src/lib/server/db/schema/index.ts',
	out: './db/migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: `file:${env.DB_URL}`
	},
	casing: 'snake_case'
})
