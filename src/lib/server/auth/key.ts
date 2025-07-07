import { db } from '$lib/server/db'
import { eq } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import { type Key, type NewKey, type User } from '$lib/server/db/schema/auth'
import { encodeBase64, decodeBase64 } from '@oslojs/encoding'

import { StructuredResponse as Response } from '$utils/structured-response'

export async function addPasskey({
	userId,
	passkeyId,
	credential,
	name
}: {
	userId: string
	passkeyId: string
	credential: Uint8Array
	name?: string
}): Promise<Response<Key | null>> {
	try {
		const credentialEncoded = encodeBase64(credential)

		const newPasskey: NewKey = {
			id: passkeyId,
			userId: userId,
			type: 'passkey',
			name: name || null,
			credential: credentialEncoded,
			createdAt: new Date()
		}

		console.log('Adding passkey to database:', { userId, passkeyId, name })

		const [result] = await db.insert(table.key).values(newPasskey).returning()
		if (result) {
			console.log('Passkey added successfully')
			return Response.succeed(result)
		} else {
			console.error('No result returned from database insert')
			return Response.fail('Failed to save passkey - no result returned')
		}
	} catch (e) {
		console.error('Database error adding passkey:', e)
		if (e instanceof Error) {
			return Response.fail(`Failed to save passkey: ${e.message}`)
		}
		return Response.fail('Failed to save passkey to database')
	}
}

export async function getPasskeyCredential(keyId: string): Promise<Uint8Array | null> {
	const [result] = await db
		.select({ credential: table.key.credential })
		.from(table.key)
		.where(eq(table.key.id, keyId))
		.limit(1)

	if (result?.credential) {
		return decodeBase64(result.credential)
	}

	return null
}

export async function getPasskeyUser(keyId: string): Promise<User | null> {
	const [result] = await db
		.select({
			id: table.user.id,
			name: table.user.name,
			identifier: table.user.identifier,
			lastSeenAt: table.user.lastSeenAt,
			createdAt: table.user.createdAt
		})
		.from(table.key)
		.innerJoin(table.user, eq(table.key.userId, table.user.id))
		.where(eq(table.key.id, keyId))
		.limit(1)

	return result || null
}

export async function getPasskeys(_identifier: string): Promise<Response<Key[] | null>> {
	// TODO: Implement getPasskeys
	return Response.fail()
}

export async function updatePasskeyName(_identifier: string): Promise<Response<Key[] | null>> {
	// TODO: Implement updatePasskeyName
	return Response.fail()
}

export async function removePasskey(_identifier: string, _keyId: string): Promise<Response<never>> {
	// TODO: Implement removePasskey
	return Response.fail()
}
