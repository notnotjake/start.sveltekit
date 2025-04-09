import { db } from '$lib/server/db'
import { eq } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import { type Key, type NewKey } from '$lib/server/db/schema'
import { encodeBase64, decodeBase64 } from '@oslojs/encoding'

import { generateAuthenticationOptions } from '@simplewebauthn/server'

import { StructuredResponse as Response } from '$utils/structured-response'
import { getUserByIdentifier } from './users'

export async function addPasskey({
	userId,
	passkeyId,
	credential
}: {
	userId: string
	passkeyId: string
	credential: Uint8Array
}): Promise<Response<Key | null>> {
	const credentialEncoded = encodeBase64(credential)

	const newPasskey: NewKey = {
		id: passkeyId,
		userId: userId,
		type: 'passkey',
		credential: credentialEncoded,
		createdAt: new Date()
	}

	try {
		const [result] = await db.insert(table.key).values(newPasskey).returning()
		if (result) return Response.succeed()
	} catch (e) {
		console.error(e)
		return Response.fail('Failed to save to databse')
	}

	return Response.fail()
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

export async function getPasskeyUser(keyId: string): Promise<string | null> {
	const [result] = await db
		.select({ userId: table.key.userId })
		.from(table.key)
		.where(eq(table.key.id, keyId))
		.limit(1)

	return result.userId
}

export async function getPasskeys(identifier: string): Promise<Response<Key[] | null>> {
	return Response.fail()
}

export async function removePasskey(identifier: string, keyId: string): Promise<Response<never>> {
	return Response.fail()
}
