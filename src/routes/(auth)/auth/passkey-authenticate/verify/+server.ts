import type { RequestHandler } from './$types'
import { json, fail } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) return fail(400)

	const body = await event.request.json()

	// Get auth attempt attached to session
	const authAttempt = await Auth.getAuthAttempt({
		sessionId: event.locals.session.id,
		type: 'passkey_login'
	})

	if (!authAttempt.success || !authAttempt.data?.credential) {
		return fail(400)
	}

	const challenge = authAttempt.data.credential

	if (!body?.id) return fail(400)
	const keyId = body.id

	const savedKey = await Auth.getPasskeyCredential(keyId)
	if (!savedKey) return fail(400)

	const attempt = await verifyAuthenticationResponse({
		response: body,
		expectedChallenge: challenge,
		expectedOrigin: 'http://localhost:5173',
		expectedRPID: 'localhost',
		credential: {
			id: keyId,
			publicKey: savedKey,
			counter: 0
		}
	})

	if (attempt.verified) {
		// find user attached
		const user = await Auth.getPasskeyUser(body.id)

		if (!user) return fail(400)

		// authenticate
		await Auth.authenticateSession({ event, user })
		const redirectUrl = Auth.getRedirectUrlCookie(event)
		return json({ success: true, redirect: redirectUrl })
	}
	return fail(400)
}
