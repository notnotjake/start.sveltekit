import { db } from '$lib/server/db'
import { eq, lt, and } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import type { AuthAttempt, NewAuthAttempt, User } from '$lib/server/db/schema/auth'
import { createUser } from './users'

import { hashToken } from './utils'
import { randomUUID } from 'crypto'

interface CreateAuthAttemptOptions {
	identifier: string
	sessionId: string
	token: string
	type?: 'email' | 'code' | 'passkey_register' | 'passkey_login' // defaults to email
	maxAgeMins?: number // defaults to 10
}
export async function createAuthAttempt({
	identifier,
	sessionId,
	token,
	type = 'email',
	maxAgeMins = 10
}: CreateAuthAttemptOptions): Promise<AuthAttempt> {
	cleanupExpiredAttempts()

	const credential = type === 'email' ? hashToken(token) : token

	const maxAgeMs = 1000 * 60 * maxAgeMins
	const authAttempt: NewAuthAttempt = {
		id: randomUUID(),
		type,
		identifier,
		sessionId,
		credential,
		expiresAt: new Date(Date.now() + maxAgeMs)
	}
	try {
		// Delete all existing auth attempts for identifier
		await db.delete(table.authAttempt).where(eq(table.authAttempt.identifier, identifier))

		// Create a new auth attempt tied to identifier and session
		const [result] = await db.insert(table.authAttempt).values(authAttempt).returning()
		return result
	} catch (error) {
		if (error instanceof Error) {
			console.error('Failed to create auth attempt', error)
		}
		throw error
	}
}

interface GetAuthAttemptOptions {
	sessionId: string
	type: 'email' | 'code' | 'passkey_register' | 'passkey_login' // defaults to email
}
export async function getAuthAttempt({
	sessionId,
	type
}: GetAuthAttemptOptions): Promise<string | null> {
	const [result] = await db
		.select({ credential: table.authAttempt.credential })
		.from(table.authAttempt)
		.where(and(eq(table.authAttempt.sessionId, sessionId), eq(table.authAttempt.type, type)))
		.limit(1)

	return result.credential
}

export async function verifyAuthAttempt(
	token: string,
	sessionId: string
): Promise<User | null | undefined> {
	const credential = hashToken(token)
	try {
		cleanupExpiredAttempts()

		const [result] = await db
			.select()
			.from(table.authAttempt)
			.where(eq(table.authAttempt.credential, credential))
			.limit(1)

		// Check that auth attempt exists
		if (!result) {
			console.log('Auth Attempt Not Found')
			return null
		}

		// Check if session is expired
		const expired = Date.now() >= result.expiresAt.getTime()
		if (expired) {
			console.log('Expired')
			await db.delete(table.authAttempt).where(eq(table.authAttempt.id, result.id))
			return null
		}

		// Delete auth attempt now that it's been used
		await db.delete(table.authAttempt).where(eq(table.authAttempt.id, result.id))

		// Get the user
		const [user] = await db
			.select()
			.from(table.user)
			.where(eq(table.user.identifier, result.identifier))
			.limit(1)

		if (user) {
			return user
		} else {
			const tempName = generateAdjectiveAnimalName()
			const newUser = await createUser(result.identifier, tempName)

			if (newUser.success) {
				return newUser.data
			} else {
				return null
			}
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error('Failed to authenticate auth attempt', error)
		}
		throw error
	}
}

export async function cleanupExpiredAttempts() {
	const currentTime = new Date()
	await db.delete(table.authAttempt).where(lt(table.authAttempt.expiresAt, currentTime))
}

export function generateAdjectiveAnimalName(): string {
	const adjectives = [
		'Cuddly',
		'Curious',
		'Brave',
		'Sly',
		'Swift',
		'Gentle',
		'Witty',
		'Fierce',
		'Jolly',
		'Quiet'
	]
	const animals = ['Koala', 'Cat', 'Fox', 'Bear', 'Wolf', 'Owl', 'Tiger', 'Panda', 'Hawk', 'Deer']
	const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
	const animal = animals[Math.floor(Math.random() * animals.length)]
	const num = Math.floor(Math.random() * 100) // Optional: adds uniqueness

	return `${adj} ${animal}${num}`
}

export type Result = { success: boolean; error?: string; message?: string; data?: any }
