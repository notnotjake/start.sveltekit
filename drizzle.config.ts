// import { env } from './src/lib/utils/env'
import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config()

export default defineConfig({
	schema: './src/lib/server/db/schema/index.ts',
	out: './db/migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: `file:${process.env.DB_URL}`
	},
	casing: 'snake_case'
})
