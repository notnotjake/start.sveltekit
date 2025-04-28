import { db } from '$lib/server/db'
import { eq, and, lt } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import { type User, type NewUser, lower } from '$lib/server/db/schema/auth'
import { randomUUID } from 'crypto'
import { generateShortCode } from './utils'
import { verifyShortCodesMatch } from './password'
import { createAuthAttempt, getAuthAttempt, cleanupAttempts } from './auth-attempt'
import { confirmChangeEmail } from '$lib/server/email/confirm-change-email'
import { alertChangeEmail } from '$lib/server/email/alert-change-email'

import { StructuredResponse as Response } from '$utils/structured-response'

export async function createUser(identifier: string, name: string): Promise<Response<User>> {
	const userExists = await db
		.select({
			createdAt: table.user.createdAt
		})
		.from(table.user)
		.where(eq(table.user.identifier, identifier))
		.limit(1)

	if (userExists.length > 0) {
		return Response.fail('User already exists')
	} else {
		const newUser: NewUser = {
			name: name,
			identifier: identifier,
			createdAt: new Date(),
			lastSeenAt: new Date(),
			id: randomUUID()
		}

		const [result] = await db.insert(table.user).values(newUser).returning()

		if (result) {
			return Response.succeed(result)
		}

		return Response.fail('Failed to create user')
	}
}

export async function getUserByIdentifier(
	identifier: string
): Promise<Response<{ exists: boolean; user: User | null }>> {
	const [userFound] = await db
		.select()
		.from(table.user)
		.where(eq(lower(table.user.identifier), identifier.toLowerCase()))
		.limit(1)

	if (userFound) {
		return Response.succeed({ exists: true, user: userFound })
	} else {
		return Response.succeed({ exists: false, user: null })
	}
}

export async function getUserKeysAvailable(userId: string): Promise<Response<Set<string>>> {
	try {
		const keys = await db
			.select({ type: table.key.type })
			.from(table.key)
			.where(eq(table.key.userId, userId))

		if (!Array.isArray(keys)) return Response.fail()

		const keysMap = new Set(keys.map((item) => item.type))

		return Response.succeed(keysMap)
	} catch (e) {
		console.log(e)
		return Response.fail()
	}
}

export async function getUserKeysOfType({
	userId,
	keyType
}: {
	userId: string
	keyType?: 'password' | 'passkey'
}): Promise<Response<Set<string>>> {
	try {
		let keys = null

		if (keyType) {
			keys = await db
				.select({ type: table.key.type, name: table.key.name, createdAt: table.key.createdAt })
				.from(table.key)
				.where(and(eq(table.key.userId, userId), eq(table.key.type, keyType)))
		} else {
			keys = await db
				.select({ type: table.key.type, name: table.key.name, createdAt: table.key.createdAt })
				.from(table.key)
				.where(eq(table.key.userId, userId))
		}

		if (!keys) return Response.fail()

		return Response.succeed(keys)
	} catch (e) {
		console.log(e)
		return Response.fail()
	}
}

export async function deleteUser(userId: string): Promise<Response<never>> {
	try {
		const result = await db.delete(table.user).where(eq(table.user.id, userId)).returning()

		if (result) {
			return Response.succeed()
		}
		return Response.fail('User deletion failed')
	} catch (e) {
		console.error(e)
		return Response.fail('User deletion failed')
	}
}

export async function updateUserName(userId: string, newValue: string): Promise<Response<never>> {
	try {
		await db.update(table.user).set({ name: newValue }).where(eq(table.user.id, userId))

		return Response.succeed()
	} catch (e) {
		console.error(e)
		return Response.fail()
	}
}

export async function updateUserIdentifier(
	userId: string,
	newValue: string
): Promise<Response<never>> {
	try {
		await db.update(table.user).set({ identifier: newValue }).where(eq(table.user.id, userId))

		return Response.succeed()
	} catch (e) {
		console.error(e)
		return Response.fail()
	}
}

export async function requestUpdateUserIdentifier({
	sessionId,
	newIdentifier,
	timezone
}: {
	sessionId: string
	newIdentifier: string
	timezone?: string
}): Promise<Response<never>> {
	const existingUser = await getUserByIdentifier(newIdentifier)
	if (!existingUser.success) return Response.fail('Something went wrong')
	if (existingUser.data?.exists) return Response.fail('User already exists')

	try {
		// generate code
		const code = generateShortCode()

		// email the code
		await confirmChangeEmail({
			email: newIdentifier,
			code,
			timezone,
			maxAgeMins: 5
		})

		// store the code
		await createAuthAttempt({
			identifier: newIdentifier,
			sessionId,
			token: code,
			type: 'code',
			maxAgeMins: 5
		})
		return Response.succeed()
	} catch (e) {
		console.error(e)
		return Response.fail('Failed to start update user identifier')
	}
}

export async function confirmUpdateUserIdentifier({
	user,
	sessionId,
	code
}: {
	user: User
	sessionId: string
	code: string
}): Promise<Response<never>> {
	try {
		// First find the auth attempt with session id
		const result = await getAuthAttempt({ sessionId, type: 'code' })
		if (!result.success || !result.data || !result.data.credential)
			return Response.fail('Failed getting auth attempt')

		// Then check the code matches
		const codeValid = await verifyShortCodesMatch({
			storedCode: result.data.credential,
			providedCode: code
		})

		if (!codeValid.success || !codeValid.data) {
			return Response.fail('Failed to validate code')
		}

		const userId = user.id

		// Then get the identifier and update the user email
		const newIdentifier = result.data.identifier

		const updateResult = await updateUserIdentifier(userId, newIdentifier)

		if (!updateResult.success) return Response.fail('Failed to update user identifier')

		// Delete code after success
		await cleanupAttempts({ identifier: result.data.identifier, sessionId: sessionId })

		// Notify user that email was updated
		await alertChangeEmail({
			email: user.identifier,
			newEmail: newIdentifier
		})

		return Response.succeed()
	} catch (e) {
		console.error(e)
		return Response.fail('Failed to update user identifier')
	}
}
