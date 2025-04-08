import { db } from '$lib/server/db'
import { eq } from 'drizzle-orm'
import * as table from '$lib/server/db/schema/auth'
import { type Key, type NewKey } from '$lib/server/db/schema'
import { encodeBase64url } from '@oslojs/encoding'

import { StructuredResponse as Response } from '$utils/structured-response'
import { getUserByIdentifier } from './users'

function encodeToString(bytes: Uint8Array): string {
	return encodeBase64url(bytes).replace(/=+$/, '')
}

export async function addPasskey({
	userId,
	passkeyId,
	credential
}: {
	userId: string
	passkeyId: string
	credential: Uint8Array
}): Promise<Response<Key | null>> {
	const credentialString = encodeToString(credential)

	const newPasskey: NewKey = {
		id: passkeyId,
		userId: userId,
		type: 'passkey',
		credential: credentialString,
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

export async function getPasskeys(identifier: string): Promise<Response<Key[] | null>> {
	return Response.fail()
}

export async function removePasskey(identifier: string, keyId: string): Promise<Response<never>> {
	return Response.fail()
}
