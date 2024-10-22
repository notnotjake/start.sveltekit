import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import * as schema from './schema'

const sqlite = new Database('./db/dev.db')

export const db = drizzle(sqlite, { schema })

sqlite.exec('PRAGMA foreign_keys = ON;')
