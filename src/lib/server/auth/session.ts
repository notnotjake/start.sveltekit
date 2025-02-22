import { db } from '$lib/server/db'
import type { RequestEvent } from '@sveltejs/kit'
import { eq, and, isNull } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import type { Session, User } from '$lib/server/db/schema/auth'

import { generateToken, hashToken } from './utils'

const DAY_IN_MS = 1000 * 60 * 60 * 24

export function generateSessionToken(): string {
	return generateToken()
}

export async function createSession(event: RequestEvent, token: string) {
	const sessionId = hashToken(token)
	const ipAddress = event.getClientAddress() || 'unknown'
	const userAgent = event.request.headers.get('user-agent') || 'unknown'
	const session: Session = {
		id: sessionId,
		userId: null,
		ipAddress,
		userAgent,
		createdAt: new Date(),
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30),
		invalidatedAt: null
	}
	console.log('A', session)
	try {
		await db.insert(table.session).values(session)
		return session
	} catch (error) {
		if (error instanceof Error) {
			console.error('Failed to create session', error)
		}
		throw error
	}
}
export async function authenticateSession(sessionId: string, userId: string) {
	try {
		await db.update(table.session).set({ userId }).where(eq(table.session.id, sessionId))
	} catch (error) {
		if (error instanceof Error) {
			console.error('Failed to create session', error)
		}
		throw error
	}
}
export async function createAuthenticatedSession(
	event: RequestEvent,
	token: string,
	userId: string
) {
	const sessionId = hashToken(token)
	const ipAddress = event.getClientAddress() || 'unknown'
	const userAgent = event.request.headers.get('user-agent') || 'unknown'
	const session: Session = {
		id: sessionId,
		userId,
		ipAddress,
		userAgent,
		createdAt: new Date(),
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30),
		invalidatedAt: null
	}
	try {
		await db.insert(table.session).values(session)
		return session
	} catch (error) {
		if (error instanceof Error) {
			console.error('Failed to create session', error)
		}
		throw error
	}
}

export async function validateSessionToken(token: string) {
	const sessionId = hashToken(token)
	const [result] = await db
		.select({
			session: table.session,
			user: {
				id: table.user.id,
				name: table.user.name,
				identifier: table.user.identifier
			}
		})
		.from(table.session)
		.leftJoin(table.user, eq(table.session.userId, table.user.id))
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

export async function invalidateSession(sessionId: string): Promise<Result> {
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

export async function invalidateAllUserSessions(userId: string): Promise<Result> {
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

export async function listAllUserSessions(userId: string): Promise<Session[] | Result> {
	try {
		const allSessions = await db
			.select()
			.from(table.session)
			.where(eq(table.session.userId, userId))
		return allSessions
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to invalidate all sessions. Unknown error.'
		}
	}
}

export type Result = { success: boolean; error?: string }

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>
