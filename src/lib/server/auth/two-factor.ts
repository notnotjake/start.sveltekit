import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema/auth'
import type { NewKey, Key } from '$lib/server/db/schema/auth'
import { randomUUID } from 'crypto'
import { createTOTPKeyURI, generateTOTP, verifyTOTPWithGracePeriod } from '@oslojs/otp'
// import { generateSecret } from 'speakeasy'
import { generateTOTPSecretKey } from './utils'
import { encodeBase32, decodeBase32 } from '@oslojs/encoding'

const ISSUER = 'Luxo'
const INTERVAL_SEC = 30
const DIGITS = 6

export async function enrollOneTimePassword({
	userId,
	userIdentifier
}: {
	userId: string
	userIdentifier: string
}) {
	const key = generateTOTPSecretKey()

	const uri = createTOTPKeyURI(ISSUER, userIdentifier, key, INTERVAL_SEC, DIGITS)

	const newOneTimePasscode: NewKey = {
		id: randomUUID(),
		userId: userId,
		type: 'one-time-password',
		name: null,
		credential: encodeBase32(key),
		createdAt: new Date()
	}

	// Insert into database
	try {
		await db.insert(table.key).values(newOneTimePasscode)
	} catch (e) {
		console.error(e)
	}

	return uri
}

export function confirmOneTimePassword({
	userIdentifier,
	providedCode
}: {
	userIdentifier: string
	providedCode: string
}): boolean {
	return false
}

export function verifyTOTPCode({
	secretKey,
	providedCode
}: {
	secretKey: Uint8Array
	providedCode: string
}): boolean {
	const gracePeriodInSeconds = 15

	const isValid = verifyTOTPWithGracePeriod(
		secretKey,
		INTERVAL_SEC,
		DIGITS,
		providedCode,
		gracePeriodInSeconds
	)

	return isValid
}
