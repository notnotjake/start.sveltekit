import { db } from '$lib/server/db'
import { eq, and, lt } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import type { User, NewUser } from '$lib/server/db/schema/auth'
import { randomUUID } from 'crypto'

export async function createUser(identifier: string, name: string): Promise<User | Result> {
	const userExists = await db
		.select({
			createdAt: table.user.createdAt
		})
		.from(table.user)
		.where(eq(table.user.identifier, identifier))
		.limit(1)

	if (userExists.length > 0) {
		return { success: false, error: 'User already exists' }
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
			return result
		}
	}
	return { success: false, error: `Couldn't create user` }
}

export async function getUserByIdentifier(identifier: string) {
	const userExists = await db
		.select({ id: table.user.id })
		.from(table.user)
		.where(eq(table.user.identifier, identifier))
		.limit(1)

	if (userExists.length > 0) {
		return userExists
	} else {
		return null
	}
}

export async function deleteUser(userId: string): Promise<Result> {
	try {
		await db.delete(table.user).where(eq(table.user.id, userId))

		return { success: true }
	} catch (error) {
		return { success: false, error: 'User deletion was unsuccessful' }
	}
}

export async function updateUserName(userId: string, newValue: string): Promise<Result> {
	try {
		await db.update(table.user).set({ name: newValue }).where(eq(table.user.id, userId))

		return { success: true }
	} catch (error) {
		return { success: false, error: 'User deletion was unsuccessful' }
	}
}

export async function updateUserIdentifier(userId: string, newValue: string): Promise<Result> {
	try {
		await db.update(table.user).set({ identifier: newValue }).where(eq(table.user.id, userId))

		return { success: true }
	} catch (error) {
		return { success: false, error: 'User deletion was unsuccessful' }
	}
}

export type Result = { success: boolean; error?: string }
