import { db } from '$lib/server/db'
import { eq, and } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import { type User, type NewKey, lower } from '$lib/server/db/schema'

import { hash, verify } from '@node-rs/argon2'
import { randomUUID } from 'crypto'

import { StructuredResponse as Response } from '$utils/structured-response'
import { getUserByIdentifier } from './users'

const passwordHashingOptions = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
}

const shortCodeHashingOptions = {
	memoryCost: 4096,
	timeCost: 1,
	outputLen: 32,
	parallelism: 1
}

export async function verifyPasswordsMatch({
	storedPassword,
	providedPassword
}: {
	storedPassword: string
	providedPassword: string
}): Promise<Response<boolean>> {
	try {
		const passwordValid = await verify(storedPassword, providedPassword, passwordHashingOptions)
		return Response.succeed(passwordValid)
	} catch (e) {
		console.error(e)
		return Response.fail()
	}
}

export async function getUserAndStoredPassword({
	identifier
}: {
	identifier: string
}): Promise<Response<{ user: User; storedPassword: string }>> {
	try {
		const [{ user, storedPassword }] = await db
			.select({
				user: table.user,
				storedPassword: table.key.credential
			})
			.from(table.user)
			.innerJoin(table.key, eq(table.key.userId, table.user.id))
			.where(
				and(
					eq(lower(table.user.identifier), identifier.toLowerCase()),
					eq(table.key.type, 'password')
				)
			)
			.limit(1)

		if (!user || !storedPassword) return Response.fail('no user or no password')

		return Response.succeed({ user, storedPassword })
	} catch (e) {
		console.error(e)
		return Response.fail('Unexpected error')
	}
}

/**
 * Adds a password for a user identified by an email or username.
 *
 * @description
 * This function performs the following steps:
 * 1. Retrieves the user by the provided identifier.
 * 2. Verifies the user exists and has a valid ID.
 * 3. Checks if the user already has a password set.
 * 4. Hashes the provided password.
 * 5. Creates a new password entry for the user.
 * 6. Inserts the password into the database.
 *
 */
export async function addPassword({
	identifier,
	password
}: {
	identifier: string
	password: string
}): Promise<Response<never>> {
	// first get the user by identifier
	const user = await getUserByIdentifier(identifier)

	if (!user.success) return Response.fail('Failed to complete request')

	const userId = user.data?.user?.id

	if (!user.data?.exists || !userId) return Response.fail('User not found')

	// check for current passwords
	const [key] = await db
		.select({
			credential: table.key.credential
		})
		.from(table.key)
		.where(eq(table.key.userId, userId))
		.limit(1)

	if (key?.credential) return Response.fail('Password already set')

	// Hash and salt password
	const passwordHash = await hash(password, passwordHashingOptions)

	// Create new object
	const newPassword: NewKey = {
		id: randomUUID(),
		userId: userId,
		type: 'password',
		credential: passwordHash,
		createdAt: new Date()
	}

	// Insert into database
	try {
		const [result] = await db.insert(table.key).values(newPassword).returning()
		if (result) return Response.succeed()
	} catch (e) {
		console.error(e)
		return Response.fail('Failed to add to database')
	}

	return Response.fail()
}

export async function updatePassword({
	identifier,
	currentPassword,
	newPassword
}: {
	identifier: string
	currentPassword: string
	newPassword: string
}): Promise<Response<never>> {
	// first get the user by identifier
	const user = await getUserByIdentifier(identifier)

	if (!user.success || !user.data?.exists || !user.data?.user?.id)
		return Response.fail('Failed to complete request')

	const userId = user.data.user.id

	// second find the users password key
	const [{ credential: storedPassword }] = await db
		.select({
			credential: table.key.credential
		})
		.from(table.key)
		.where(eq(table.key.userId, userId))
		.limit(1)

	if (!storedPassword) return Response.fail('No current password found')

	// verify that password
	const passwordValid = await verify(storedPassword, currentPassword, passwordHashingOptions)

	if (passwordValid) {
		// update to new password
		try {
			// Hash and salt password
			const passwordHash = await hash(newPassword, passwordHashingOptions)

			await db
				.update(table.key)
				.set({ credential: passwordHash, createdAt: new Date() })
				.where(eq(table.key.userId, userId))
				.returning()
			return Response.succeed()
		} catch (e) {
			console.error(e)
			return Response.fail('Failed to update in database')
		}
	} else {
		return Response.fail('Password not accepted')
	}
}

export async function hashShortCode(code: string): Promise<Response<string>> {
	try {
		const hashedCode = await hash(code, shortCodeHashingOptions)
		return Response.succeed(hashedCode)
	} catch (e) {
		console.error(e)
		return Response.fail('failed to hash')
	}
}

export async function verifyShortCodesMatch({
	storedCode,
	providedCode
}: {
	storedCode: string
	providedCode: string
}): Promise<Response<boolean>> {
	try {
		const codeValid = await verify(storedCode, providedCode, shortCodeHashingOptions)
		return Response.succeed(codeValid)
	} catch (e) {
		console.error(e)
		return Response.fail()
	}
}
