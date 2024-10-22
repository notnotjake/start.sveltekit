import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	dialect: 'sqlite',
	schema: './app/lib/server/db/schema.ts',
	out: './db',
	dbCredentials: {
		url: 'file:./db/dev.db'
	}
})
