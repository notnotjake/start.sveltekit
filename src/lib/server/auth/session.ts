import { db } from '$lib/server/db'
import type { RequestEvent } from '@sveltejs/kit'
import { eq, and, lt, isNull } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import type { User, Session } from '$lib/server/db/schema/auth'

import { StructuredResponse as Response } from '$utils/structured-response'
import { clearStepUpReauthCookie } from './cookie'

import { generateToken, hashToken } from './utils'
import { cleanupAttempts } from './auth-attempt'

const DAY_IN_MS = 1000 * 60 * 60 * 24

export async function createUnauthenticatedSession(
	event: RequestEvent
): Promise<Response<{ session: Session; rawSessionToken: string }>> {
	const rawSessionToken = generateToken()
	const sessionId = hashToken(rawSessionToken)

	const ipAddress = event.getClientAddress() || 'unknown'
	const userAgent = event.request.headers.get('user-agent') || 'unknown'

	const session: Session = {
		id: sessionId,
		userId: null,
		ipAddress,
		userAgent,
		lastSeenAt: new Date(),
		createdAt: new Date(),
		lastAuthAt: null,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 7),
		invalidatedAt: null
	}

	try {
		const [newSession] = await db.insert(table.session).values(session).returning()
		return Response.succeed({ session: newSession, rawSessionToken })
	} catch (error) {
		console.error('Failed to create session', error)
		return Response.fail()
	}
}

/**
 * Authenticates a user session after successful verification via magic link, passkey, or password.
 *
 * This function updates the session record in the database with the provided user ID and
 * the current timestamp, effectively attaching the user to the session. It also clears
 * any step-up reauthentication cookies and performs cleanup of old invalid sessions.

 *
 * @throws Will return a failure response if no session ID is provided or if database operations fail
 *
 */
export async function authenticateSession({
	event,
	user
}: {
	event: RequestEvent
	user: User
}): Promise<Response<never>> {
	try {
		if (!event.locals.session?.id) {
			return Response.fail('No session id provided')
		}

		await db
			.update(table.session)
			.set({ userId: user.id, lastAuthAt: new Date() })
			.where(eq(table.session.id, event.locals.session?.id))

		clearStepUpReauthCookie(event)

		await cleanupOldInvalidSessions()

		await cleanupAttempts({
			identifier: user.identifier,
			sessionId: event.locals.session.id
		})

		return Response.succeed()
	} catch (error) {
		console.error('Failed to authenticate session', error)
		return Response.fail()
	}
}

/**
 * Rotates the session ID to prevent session fixation attacks.
 * Creates a new session with a new ID while preserving session data.
 *
 * @param sessionId - The current session ID to rotate
 * @param event - The request event for IP and user agent
 * @returns Response with new session and raw token, or failure
 */
export async function rotateSession(
	sessionId: string,
	event: RequestEvent
): Promise<Response<{ session: Session; rawSessionToken: string }>> {
	try {
		// Get the current session
		const [currentSession] = await db
			.select()
			.from(table.session)
			.where(eq(table.session.id, sessionId))

		if (!currentSession) {
			return Response.fail('Session not found')
		}

		if (currentSession.invalidatedAt !== null) {
			return Response.fail('Session already invalidated')
		}

		// Generate new session token and ID
		const rawSessionToken = generateToken()
		const newSessionId = hashToken(rawSessionToken)

		const ipAddress = event.getClientAddress() || 'unknown'
		const userAgent = event.request.headers.get('user-agent') || 'unknown'

		// Create new session with same data but new ID
		const newSession: Session = {
			id: newSessionId,
			userId: currentSession.userId,
			ipAddress,
			userAgent,
			lastSeenAt: new Date(),
			createdAt: new Date(),
			lastAuthAt: currentSession.lastAuthAt,
			expiresAt: currentSession.expiresAt,
			invalidatedAt: null
		}

		// Insert new session and invalidate old one in a transaction
		await db.transaction(async (tx) => {
			await tx.insert(table.session).values(newSession)
			await tx
				.update(table.session)
				.set({ invalidatedAt: new Date() })
				.where(eq(table.session.id, sessionId))
		})

		return Response.succeed({ session: newSession, rawSessionToken })
	} catch (error) {
		console.error('Failed to rotate session', error)
		return Response.fail()
	}
}

/**
 * Rotates session ID and authenticates it with a user in one operation.
 * This is useful during login to prevent session fixation attacks.
 *
 * @param sessionId - The current session ID to rotate and authenticate
 * @param event - The request event for IP and user agent
 * @param user - The user to authenticate the session with
 * @returns Response with new authenticated session and raw token, or failure
 */
export async function rotateAndAuthenticateSession({
	sessionId,
	event,
	user
}: {
	sessionId: string
	event: RequestEvent
	user: User
}): Promise<Response<{ session: Session; rawSessionToken: string }>> {
	try {
		// Get the current session
		const [currentSession] = await db
			.select()
			.from(table.session)
			.where(eq(table.session.id, sessionId))

		if (!currentSession) {
			return Response.fail('Session not found')
		}

		if (currentSession.invalidatedAt !== null) {
			return Response.fail('Session already invalidated')
		}

		// Generate new session token and ID
		const rawSessionToken = generateToken()
		const newSessionId = hashToken(rawSessionToken)

		const ipAddress = event.getClientAddress() || 'unknown'
		const userAgent = event.request.headers.get('user-agent') || 'unknown'

		// Create new authenticated session
		const newSession: Session = {
			id: newSessionId,
			userId: user.id,
			ipAddress,
			userAgent,
			lastSeenAt: new Date(),
			createdAt: new Date(),
			lastAuthAt: new Date(),
			expiresAt: new Date(Date.now() + DAY_IN_MS * 30), // Extend expiry for authenticated session
			invalidatedAt: null
		}

		// Insert new session and invalidate old one in a transaction
		await db.transaction(async (tx) => {
			await tx.insert(table.session).values(newSession)
			await tx
				.update(table.session)
				.set({ invalidatedAt: new Date() })
				.where(eq(table.session.id, sessionId))
		})

		// Clean up
		clearStepUpReauthCookie(event)
		await cleanupOldInvalidSessions()
		await cleanupAttempts({
			identifier: user.identifier,
			sessionId: newSessionId // Use new session ID
		})

		return Response.succeed({ session: newSession, rawSessionToken })
	} catch (error) {
		console.error('Failed to rotate and authenticate session', error)
		return Response.fail()
	}
}

export async function createAuthenticatedSession(
	event: RequestEvent,
	userId: string
): Promise<Response<{ session: Session; rawSessionToken: string }>> {
	const rawSessionToken = generateToken()
	const sessionId = hashToken(rawSessionToken)

	const ipAddress = event.getClientAddress() || 'unknown'
	const userAgent = event.request.headers.get('user-agent') || 'unknown'

	const session: Session = {
		id: sessionId,
		userId,
		ipAddress,
		userAgent,
		lastSeenAt: new Date(),
		createdAt: new Date(),
		lastAuthAt: new Date(),
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30),
		invalidatedAt: null
	}

	try {
		const [newSession] = await db.insert(table.session).values(session).returning()
		return Response.succeed({ session: newSession, rawSessionToken })
	} catch (error) {
		console.error('Failed to create session', error)
		return Response.fail()
	}
}

export async function validateSessionToken(token: string) {
	const sessionId = hashToken(token)
	const [result] = await db
		.select({
			session: table.session,
			user: table.user
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
		// TODO: return something to notify user that they have been logged out
		// maybe also autofilling the same identifier?
		return { session: null, user: null }
	}

	// Check if session is expired
	const sessionExpired = Date.now() >= session.expiresAt.getTime()
	if (sessionExpired) {
		// TODO: return something to notify user that their login expired and they've been logged out
		// maybe also autofilling the same identifier?
		return { session: null, user: null }
	}

	// Update times
	let needsUpdate = false
	const updateData: { lastSeenAt?: Date; expiresAt?: Date } = {}

	// If all is well, then renew session
	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 20 // 20 days
	if (renewSession) {
		needsUpdate = true
		const newExpiresAt = new Date(Date.now() + DAY_IN_MS * 30)
		updateData.expiresAt = newExpiresAt
		session.expiresAt = newExpiresAt
	}

	const updateLastSeen = Date.now() >= session.lastSeenAt.getTime() + 5 * 60 * 1000 // 5 mins
	if (updateLastSeen) {
		needsUpdate = true
		const newLastSeenAt = new Date()
		updateData.lastSeenAt = newLastSeenAt
		session.lastSeenAt = newLastSeenAt
	}

	if (needsUpdate) {
		await db.update(table.session).set(updateData).where(eq(table.session.id, session.id))
	}

	return { session, user }
}

export async function invalidateSession(sessionId: string): Promise<Response<never>> {
	try {
		await db
			.update(table.session)
			.set({ invalidatedAt: new Date() })
			.where(eq(table.session.id, sessionId))

		return Response.succeed()
	} catch (error) {
		return Response.fail('Failed to invalidate session')
	}
}

export async function invalidateAllUserSessions(userId: string): Promise<Response<never>> {
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

		if (activeSession) return Response.fail('Failed to invalidate all sessions')

		return Response.succeed()
	} catch (error) {
		return Response.fail('Failed to invalidate all sessions')
	}
}

export async function listAllUserSessions(userId: string): Promise<Response<Session[]>> {
	try {
		const allSessions = await db
			.select()
			.from(table.session)
			.where(eq(table.session.userId, userId))

		return Response.succeed(allSessions)
	} catch (error) {
		return Response.fail('Failed to get all sessions')
	}
}

export async function cleanupOldInvalidSessions(): Promise<Response<never>> {
	try {
		const retentionWindow = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days in ms

		await db.delete(table.session).where(lt(table.session.invalidatedAt, retentionWindow))

		return Response.succeed()
	} catch (e) {
		console.error('hee', e)
		return Response.fail()
	}
}
