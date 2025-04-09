import { db } from '$lib/server/db'
import { eq, lt, and, or } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import type { AuthAttempt } from '$lib/server/db/schema/auth'

import { hash } from '@node-rs/argon2'
import { randomUUID } from 'crypto'
import { hashToken } from './utils'

import { StructuredResponse as Response } from '$utils/structured-response'

export async function createAuthAttempt({
	identifier,
	sessionId,
	token,
	type = 'email',
	maxAgeMins = 10
}: {
	identifier: string
	sessionId: string
	token: string
	type?: 'email' | 'code' | 'passkey_register' | 'passkey_login'
	maxAgeMins?: number
}): Promise<Response<AuthAttempt>> {
	cleanupExpiredAttempts()

	let credential: string
	if (type === 'email') {
		// For magic link emails we want to store a simple hash of the token
		credential = hashToken(token)

		await cleanupAttempts({ identifier, sessionId })
	} else if (type === 'code') {
		// For 6 digit codes, because there is less entropy, we salt and hash
		const argon2HashingOptions = {
			memoryCost: 4096,
			timeCost: 1,
			outputLen: 32,
			parallelism: 1
		}
		credential = await hash(token, argon2HashingOptions)

		await cleanupAttemptsByType({ type: 'code', sessionId, identifier })
	} else if (type === 'passkey_login' || type === 'passkey_register') {
		// For passkeys, we store the raw token (the challenge)
		credential = token

		if (identifier) {
			await cleanupAttemptsByType({ type, sessionId, identifier })
		} else {
			await cleanupAttemptsBySessionId({ sessionId })
		}
	} else {
		return Response.fail('auth attempt type not valid')
	}

	try {
		// Create a new auth attempt tied to identifier and session
		const [result] = await db
			.insert(table.authAttempt)
			.values({
				id: randomUUID(),
				type,
				identifier,
				sessionId,
				credential,
				expiresAt: new Date(Date.now() + maxAgeMins * 60 * 1000)
			})
			.returning()

		console.log('new attempt', result)

		return Response.succeed(result)
	} catch (error) {
		if (error instanceof Error) {
			console.error('Failed to create auth attempt', error)
		}
		return Response.fail('Failed to save auth attempt to db')
	}
}

type GetAuthAttemptOptions =
	| { type: 'email'; token: string; sessionId?: never }
	| { type: 'code' | 'passkey_register' | 'passkey_login'; sessionId: string; token?: never }

export async function getAuthAttempt({
	sessionId,
	token,
	type
}: GetAuthAttemptOptions): Promise<Response<AuthAttempt>> {
	cleanupExpiredAttempts()

	if (type === 'email') {
		const credential = hashToken(token)
		const [result] = await db
			.select()
			.from(table.authAttempt)
			.where(eq(table.authAttempt.credential, credential))
			.limit(1)

		return Response.succeed(result)
	} else if (type === 'code') {
		const [result] = await db
			.select()
			.from(table.authAttempt)
			.where(and(eq(table.authAttempt.sessionId, sessionId), eq(table.authAttempt.type, type)))
			.limit(1)

		return Response.succeed(result)
	} else if (type === 'passkey_login' || type === 'passkey_register') {
		const [result] = await db
			.select()
			.from(table.authAttempt)
			.where(and(eq(table.authAttempt.sessionId, sessionId), eq(table.authAttempt.type, type)))
			.limit(1)

		return Response.succeed(result)
	}

	return Response.fail('auth attempt type not valid')
}

export async function cleanupAttempts({
	identifier,
	sessionId
}: {
	identifier: string
	sessionId: string
}): Promise<Response<unknown>> {
	if (identifier && sessionId) {
		// Delete any existing auth attempts for this identifier OR this session
		try {
			await db
				.delete(table.authAttempt)
				.where(
					or(
						eq(table.authAttempt.identifier, identifier),
						eq(table.authAttempt.sessionId, sessionId)
					)
				)
		} catch (error) {
			return Response.fail('Failed deleting email auth attempts')
		}
	}

	return Response.fail()
}
export async function cleanupAttemptsByType({
	identifier,
	sessionId,
	type
}: {
	identifier: string | null
	sessionId: string | null
	type: 'email' | 'code' | 'passkey_login' | 'passkey_register'
}): Promise<Response<unknown>> {
	if (identifier && sessionId) {
		// Delete any existing auth attempts of the same type for this identifier OR this session
		try {
			await db
				.delete(table.authAttempt)
				.where(
					or(
						and(eq(table.authAttempt.identifier, identifier), eq(table.authAttempt.type, type)),
						and(eq(table.authAttempt.sessionId, sessionId), eq(table.authAttempt.type, type))
					)
				)
		} catch (error) {
			return Response.fail('Failed deleting email auth attempts')
		}
	}

	return Response.fail()
}
export async function cleanupAttemptsBySessionId({
	sessionId
}: {
	sessionId: string
}): Promise<Response<unknown>> {
	// Delete any existing auth attempts with the same sessionId
	try {
		await db.delete(table.authAttempt).where(eq(table.authAttempt.sessionId, sessionId))
	} catch (error) {
		return Response.fail('Failed to delete auth attempts by session id')
	}

	return Response.fail()
}

export async function cleanupExpiredAttempts() {
	const currentTime = new Date()
	await db.delete(table.authAttempt).where(lt(table.authAttempt.expiresAt, currentTime))
}
