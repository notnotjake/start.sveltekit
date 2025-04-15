import { db } from '$lib/server/db'
import { eq, lt, and } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import { type AuthAttempt, type User, lower } from '$lib/server/db/schema/auth'
import { createUser, getUserByIdentifier } from './users'
import { generateRandomName, generateShortCode } from './utils'
import { getAuthAttempt, createAuthAttempt, cleanupAttempts } from './auth-attempt'
import { verifyPasswordsMatch, getUserAndStoredPassword, verifyShortCodesMatch } from './password'

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

export async function verifyLoginWithCode({
	identifier,
	sessionId,
	providedCode
}: {
	identifier: string
	sessionId: string
	providedCode: string
}): Promise<Response<User>> {
	const result = await getAuthAttempt({ sessionId, type: 'code' })

	if (!result.success || !result.data) {
		return Response.fail('no attempt found')
	}

	const authAttempt = result.data

	if (authAttempt.credential === null) {
		return Response.fail('no attempt found')
	}
	const storedCode = authAttempt.credential

	if (authAttempt.identifier !== identifier) return Response.fail('identifiers do not match')

	const codeValid = await verifyShortCodesMatch({
		storedCode,
		providedCode
	})

	if (!codeValid.success || !codeValid.data) {
		return Response.fail('Failed to validate code')
	}

	// Remove all attempts associated with identifier or session
	await cleanupAttempts({ identifier: authAttempt.identifier, sessionId: authAttempt.sessionId })

	const userResult = await getUserByIdentifier(identifier)

	if (!userResult.success || !userResult.data?.exists || !userResult.data.user) {
		return Response.fail('Failed to get user')
	}

	return Response.succeed(userResult.data.user)
}

export async function verifyLoginWithPassword({
	identifier,
	providedPassword
}: {
	identifier: string
	providedPassword: string
}): Promise<Response<User>> {
	const result = await getUserAndStoredPassword({ identifier })

	if (!result || !result.data?.user || !result.data?.storedPassword) {
		return Response.fail('no password found for user')
	}

	const { user, storedPassword } = result.data

	const passwordValid = await verifyPasswordsMatch({ storedPassword, providedPassword })

	if (passwordValid.success && passwordValid.data) {
		return Response.succeed(user)
	} else {
		return Response.fail('Password not accepted')
	}
}

export async function verifyLoginWithPasskey({}): Promise<Response<User>> {
	return Response.fail()
}
