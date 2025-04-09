import type { RequestHandler } from './$types'
import { json, fail } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { generateAuthenticationOptions } from '@simplewebauthn/server'

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) return fail(400)

	// Create Passkey Challenge Options
	const optionsJSON = await generateAuthenticationOptions({
		rpID: 'localhost',
		userVerification: 'preferred'
	})

	await Auth.createAuthAttempt({
		identifier: '',
		sessionId: event.locals.session.id,
		token: optionsJSON.challenge,
		type: 'passkey_login',
		maxAgeMins: 2
	})

	return json({ success: true, data: { optionsJSON } })
}
