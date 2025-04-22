import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './src/lib/server/db/schema/'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

config()

// Get the current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Database path
const dbPath = process.env.DB_URL || './db/dev.db'

async function runMigrations() {
	try {
		console.log(`Initializing database at: ${dbPath}`)

		// Connect to the database
		const sqlite = new Database(dbPath)
		const db = drizzle(sqlite, { schema })

		// Run migrations
		console.log('Running migrations...')
		await migrate(db, { migrationsFolder: resolve(__dirname, './db/migrations') })
		console.log('Migrations complete')

		// Close the database connection
		sqlite.close()
	} catch (error) {
		console.error('Error during migration:', error)
		process.exit(1)
	}
}

runMigrations()
