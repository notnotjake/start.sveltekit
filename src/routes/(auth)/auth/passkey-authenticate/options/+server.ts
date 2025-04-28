import type { RequestHandler } from './$types'
import { json, fail } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { generateAuthenticationOptions } from '@simplewebauthn/server'

type KeyReturn = {
	id: string
	name: string | null
	type: string
	createdAt: Date
}

export const POST: RequestHandler = async (event) => {
	const session = await Auth.protect.requireSession(event)

	const data = await event.request.json()

	console.log(data.identifier)

	if (!data.identifier) {
		return json({ success: false, data: null })
	}

	const userId = await Auth.getUserByIdentifier(data.identifier)
	if (!userId.success || !userId.data?.user?.id) {
		return json({ success: false, data: null })
	}

	const passkeysReturn = await Auth.getUserKeysOfType({
		userId: userId.data?.user?.id,
		keyType: 'passkey'
	})

	if (!passkeysReturn.success || !passkeysReturn.data) {
		return json({ success: false, data: null })
	}

	let passkeys: KeyReturn[] = []

	if (passkeysReturn.success && passkeysReturn.data && Array.isArray(passkeysReturn.data)) {
		passkeys = passkeysReturn.data
	}

	// If we have no passkeys, return early
	if (passkeys.length === 0) {
		return json({ success: false, data: null })
	}

	const options = await generateAuthenticationOptions({
		allowCredentials: passkeys.map((passkey) => ({
			id: passkey.id,
			type: 'public-key'
		})),
		userVerification: 'preferred',
		timeout: 60000,
		rpID: 'localhost'
	})

	await Auth.createAuthAttempt({
		identifier: data.identifier,
		sessionId: session.id,
		token: options.challenge,
		type: 'passkey_login',
		maxAgeMins: 2
	})

	return json({ success: true, data: { optionsJSON: options } })
}
