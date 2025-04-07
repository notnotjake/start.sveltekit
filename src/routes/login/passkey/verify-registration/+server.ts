import type { RequestHandler } from './$types'
import { json, fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { verifyRegistrationResponse } from '@simplewebauthn/server'

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) return fail(400)

	const body = await event.request.json()

	const challenge = await Auth.getAuthAttempt({
		sessionId: event.locals.session.id,
		type: 'passkey_register'
	})

	if (!challenge) return fail(400)

	const attempt = await verifyRegistrationResponse({
		response: body,
		expectedChallenge: challenge,
		expectedOrigin: 'http://localhost:5173',
		expectedRPID: 'localhost',
		requireUserVerification: true
	})

	if (attempt.verified) {
		console.log('SUCCESS', attempt)
		return json({ success: true, message: 'Passkey registered successfully' })
	} else {
		return json({ success: false, message: 'PVerification failed' })
	}
}
