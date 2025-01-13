import { db } from '$lib/server/db'
import { eq, and, isNull } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import type { Session, User } from '$lib/server/db/schema/auth'
import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding'

const DAY_IN_MS = 1000 * 60 * 60 * 24

export function generateToken(byteLength: number = 32): string {
	const bytes = crypto.getRandomValues(new Uint8Array(byteLength))
	return encodeBase64url(bytes)
}

export function hashToken(token: string): string {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
}

export function generateSessionToken(): string {
	return generateToken()
}

export function generateMagicLinkToken(): string {
	return generateToken()
}

export function createSession(token: string, userId: string): Session {
	const sessionId = hashToken(token)
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30),
		invalidatedAt: null
	}
	db.insert(table.session).values(session)
	return session
}

export async function validateSession(token: string): Promise<SessionValidationResult> {
	const sessionId = hashToken(token)
	const [result] = await db
		.select({
			user: table.user,
			session: table.session
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId))

	// Check if a session exists for that user
	if (!result) {
		return { session: null, user: null }
	}

	const { session, user } = result

	// Check if the session has been invalidated
	if (session.invalidatedAt !== null) {
		return { session: null, user: null }
	}

	// Check if session is expired
	const sessionExpired = Date.now() >= session.expiresAt.getTime()
	if (sessionExpired) {
		return { session: null, user: null }
	}

	// If all is well, then renew session
	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 20
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30)
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id))
	}

	return { session, user }
}

export async function invalidateSession(
	sessionId: string
): Promise<{ success: boolean; error?: string }> {
	try {
		// Perform invalidation
		const [affectedSession] = await db
			.update(table.session)
			.set({ invalidatedAt: new Date() })
			.where(eq(table.session.id, sessionId))
			.returning()
		// Verify the session is invalidated
		if (!affectedSession) {
			return {
				success: false,
				error: 'Failed to invalidate session'
			}
		}

		return { success: true }
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to invalidate session. Unknown error.'
		}
	}
}

export async function invalidateAllUserSessions(
	userId: string
): Promise<{ success: boolean; error?: string }> {
	try {
		// Perform invalidation
		await db
			.update(table.session)
			.set({ invalidatedAt: new Date() })
			.where(and(eq(table.session.userId, userId), isNull(table.session.invalidatedAt)))
		// Verify no active session remains
		const [activeSession] = await db
			.select()
			.from(table.session)
			.where(and(eq(table.session.userId, userId), isNull(table.session.invalidatedAt)))
			.limit(1)
		if (activeSession) {
			return {
				success: false,
				error: 'Failed to invalidate all sessions'
			}
		}
		return { success: true }
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to invalidate all sessions. Unknown error.'
		}
	}
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null }
