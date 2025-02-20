import { db } from '$lib/server/db'
import { eq, and } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import type { AuthAttempt, NewAuthAttempt } from '$lib/server/db/schema/auth'

import { hashToken } from './utils'
import { randomUUID } from 'crypto'

export async function createAuthAttempt(
	identifier: string,
	sessionId: string,
	token: string,
	maxAgeMins: number = 10
): Promise<AuthAttempt> {
	const credential = hashToken(token)
	const maxAgeMs = 1000 * 60 * maxAgeMins
	const authAttempt: NewAuthAttempt = {
		id: randomUUID(),
		type: 'email',
		identifier,
		sessionId,
		credential,
		expiresAt: new Date(Date.now() + maxAgeMs)
	}
	try {
		// Delete all existing auth attempts for identifier
		await db.delete(table.authAttempt).where(eq(table.authAttempt.identifier, identifier))

		// Create a new auth attempt tied to identifier and session
		const [result] = await db.insert(table.authAttempt).values(authAttempt).returning()
		return result
	} catch (error) {
		if (error instanceof Error) {
			console.error('Failed to create auth attempt', error)
		}
		throw error
	}
}

export async function verifyAuthAttempt(token: string, sessionId: string): Promise<string | null> {
	console.log('IN', token, sessionId)
	const credential = hashToken(token)
	try {
		const [result] = await db
			.select()
			.from(table.authAttempt)
			.where(
				and(
					eq(table.authAttempt.credential, credential),
					eq(table.authAttempt.sessionId, sessionId)
				)
			)
			.limit(1)

		console.log('Result', result)

		if (!result) {
			console.log('Not Found')
			return null
		}

		// Check if session is expired
		const expired = Date.now() >= result.expiresAt.getTime()
		if (expired) {
			console.log('Expired')
			await db.delete(table.authAttempt).where(eq(table.authAttempt.id, result.id))

			return null
		}

		await db.delete(table.authAttempt).where(eq(table.authAttempt.id, result.id))

		return result.identifier
	} catch (error) {
		if (error instanceof Error) {
			console.error('Failed to authenticate auth attempt', error)
		}
		throw error
	}
}
