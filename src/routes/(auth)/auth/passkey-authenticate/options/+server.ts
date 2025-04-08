import type { RequestHandler } from './$types'
import { json, fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { generateRegistrationOptions } from '@simplewebauthn/server'

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) return fail(400)
	if (!event.locals.user) return fail(400)

	if (!event.locals.user.name || !event.locals.user.identifier) return fail(400)

	const options = await generateRegistrationOptions({
		rpName: 'Luxo',
		rpID: 'localhost',
		timeout: 60000,
		userName: event.locals.user.identifier,
		userDisplayName: event.locals.user.name
	})

	await Auth.createAuthAttempt({
		identifier: event.locals.user.identifier,
		sessionId: event.locals.session.id,
		token: options.challenge,
		type: 'passkey_register',
		maxAgeMins: 2
	})

	return json({ success: true, data: { options } })
}
