import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'

config()

export default defineConfig({
	schema: './src/lib/server/db/schema/index.ts',
	out: './db/migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: process.env.DB_URL || './db/dev.db'
	},
	casing: 'snake_case'
})
