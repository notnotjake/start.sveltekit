import type { RequestHandler } from './$types'
import { json, fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) return fail(400)

	const body = await event.request.json()

	// Get auth attempt attached to session
	const challenge = await Auth.getAuthAttempt({
		sessionId: event.locals.session.id,
		type: 'passkey_login'
	})

	if (!challenge) return fail(400)

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
		const userId = await Auth.getPasskeyUser(body.id)

		if (!userId) return fail(400)

		// authenticate
		await Auth.authenticateSession({ event, userId })
		const redirectUrl = Auth.getRedirectUrl(event)
		return json({ success: true, redirect: redirectUrl })
	}
	return fail(400)
}
