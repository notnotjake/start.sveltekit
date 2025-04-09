import { db } from '$lib/server/db'
import { eq, lt, and } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import type { AuthAttempt, User } from '$lib/server/db/schema/auth'
import { createUser, getUserByIdentifier } from './users'
import { generateRandomName, generateShortCode } from './utils'
import { getAuthAttempt, createAuthAttempt, cleanupAttempts } from './auth-attempt'

import { hash, verify } from '@node-rs/argon2'
import { randomUUID } from 'crypto'
import { StructuredResponse as Response } from '$utils/structured-response'

export async function verifyLoginWithEmail({
	token,
	sessionId
}: {
	token: string
	sessionId: string
}): Promise<Response<{ user: User | null; code: string | null }>> {
	const result = await getAuthAttempt({ type: 'email', token })

	if (result.success && !result.data) return Response.fail('invalid token')
	if (!result.success || !result.data) return Response.fail('Failed getting auth attempt')

	const authAttempt = result.data

	if (sessionId === authAttempt.sessionId) {
		// Remove all attempts associated with identifier or session
		await cleanupAttempts({ identifier: authAttempt.identifier, sessionId: authAttempt.sessionId })

		// Return user or a new user
		const userResult = await getUserByIdentifier(authAttempt.identifier)

		if (!userResult.success || !userResult.data) return Response.fail('Failed trying to get user')

		if (userResult.data.exists && userResult.data.user) {
			return Response.succeed({ user: userResult.data.user, code: null })
		} else {
			const randomName = generateRandomName()
			const newUserResult = await createUser(authAttempt.identifier, randomName)

			if (!newUserResult.success || !newUserResult.data) {
				return Response.fail('Failed to create new user')
			}

			return Response.succeed({ user: newUserResult.data, code: null })
		}
	} else {
		// Switch to using code to authenticate
		const shortCode = generateShortCode()

		const newAuthAttemptResult = await createAuthAttempt({
			identifier: authAttempt.identifier,
			sessionId: authAttempt.sessionId,
			token: shortCode,
			type: 'code',
			maxAgeMins: 2
		})

		if (!newAuthAttemptResult.success) return Response.fail()

		return Response.succeed({ user: null, code: shortCode })
	}
}

export async function verifyLoginWithCode({}): Promise<Response<User>> {
	// will need to invalidate (cleanup) codes when validating

	return Response.fail()
}

export async function verifyLoginWithPassword({}): Promise<Response<User>> {
	return Response.fail()
}

export async function verifyLoginWithPasskey({}): Promise<Response<User>> {
	return Response.fail()
}
