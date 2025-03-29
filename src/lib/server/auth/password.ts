import { db } from '$lib/server/db'
import { eq } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import { type User, type NewKey } from '$lib/server/db/schema'

import { hash, verify } from '@node-rs/argon2'
import { randomUUID } from 'crypto'

import { StructuredResponse as Response } from '$utils/structured-response'
import { getUserByIdentifier } from './users'

const hashingOptions = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
}

export async function verifyPassword(
	identifier: string,
	password: string
): Promise<Response<string>> {
	// first get the user by identifier
	const user = await getUserByIdentifier(identifier)

	if (!user.success) return Response.fail('Failed to complete request')

	if (!user.data?.exists || !user.data?.id) return Response.fail('User not found')

	// second find the users password key
	const [{ credential: storedPassword }] = await db
		.select({
			credential: table.key.credential
		})
		.from(table.key)
		.where(eq(table.key.userId, user.data.id))
		.limit(1)

	if (!storedPassword) return Response.fail('No password found')

	// verify that password
	const passwordValid = await verify(storedPassword, password, hashingOptions)
	if (passwordValid) {
		return Response.succeed(user.data?.id)
	} else {
		return Response.fail('Password not accepted')
	}
}

export async function addPassword(identifier: string, password: string): Promise<Response<never>> {
	// first get the user by identifier
	const user = await getUserByIdentifier(identifier)

	if (!user.success) return Response.fail('Failed to complete request')

	if (!user.data?.exists || !user.data?.id) return Response.fail('User not found')

	// Hash and salt password
	const passwordHash = await hash(password, hashingOptions)

	// Create new object
	const newPassword: NewKey = {
		id: randomUUID(),
		userId: user.data.id,
		type: 'password',
		credential: passwordHash,
		createdAt: new Date(),
		updatedAt: new Date()
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
