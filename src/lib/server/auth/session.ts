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
