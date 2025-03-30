import { db } from '$lib/server/db'
import { eq, and, lt } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import type { User, NewUser } from '$lib/server/db/schema/auth'
import { randomUUID } from 'crypto'

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
		.where(eq(table.user.identifier, identifier.toLowerCase()))
		.limit(1)

	if (userFound) {
		return Response.succeed({ exists: true, user: userFound })
	} else {
		return Response.succeed({ exists: false, user: null })
	}
}

export async function getUserKeysAvailable(userId: string): Promise<Response<unknown>> {
	try {
		const keys = await db
			.select({ type: table.key.type })
			.from(table.key)
			.where(eq(table.key.userId, userId))
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
	} catch (error) {
		console.log(error)
		return Response.fail('User deletion failed')
	}
}

export async function updateUserName(userId: string, newValue: string): Promise<Response<never>> {
	try {
		await db.update(table.user).set({ name: newValue }).where(eq(table.user.id, userId))

		return Response.succeed()
	} catch (error) {
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
	} catch (error) {
		return Response.fail()
	}
}
