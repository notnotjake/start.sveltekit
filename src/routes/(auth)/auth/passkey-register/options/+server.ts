import { env } from '$env/dynamic/public'
import type { RequestHandler } from './$types'
import { json, fail } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { generateRegistrationOptions } from '@simplewebauthn/server'

const rpID = env.PUBLIC_URL_ID || 'localhost'
const rpName = env.PUBLIC_SITE_NAME || 'Example'

export const POST: RequestHandler = async (event) => {
	await Auth.protect.requireRecentAuth(event)

	const session = await Auth.protect.requireSession(event)
	const user = await Auth.protect.requireAuthenticatedUser(event)

	const options = await generateRegistrationOptions({
		rpName,
		rpID,
		timeout: 60000,
		userName: user.identifier,
		userDisplayName: user.name || ''
	})

	await Auth.createAuthAttempt({
		identifier: user.identifier,
		sessionId: session.id,
		token: options.challenge,
		type: 'passkey_register',
		maxAgeMins: 2
	})

	return json({ success: true, data: { options } })
}
