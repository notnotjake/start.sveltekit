import type { RequestHandler } from './$types'
import { json, error } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) {
		// Use error() instead of fail() here
		throw error(400, 'No session found')
	}

	const body = await event.request.json()

	// Get auth attempt attached to session
	const authAttempt = await Auth.getAuthAttempt({
		sessionId: event.locals.session.id,
		type: 'passkey_login'
	})

	if (!authAttempt.success || !authAttempt.data?.credential) {
		throw error(400, 'Invalid auth attempt')
	}

	const challenge = authAttempt.data.credential

	if (!body?.id) {
		throw error(400, 'Missing credential ID')
	}

	const keyId = body.id

	const savedKey = await Auth.getPasskeyCredential(keyId)
	if (!savedKey) {
		throw error(400, 'Credential not found')
	}

	try {
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

			if (!user) {
				throw error(400, 'User not found')
			}

			// authenticate
			await Auth.authenticateSession({ event, user })
			const redirectUrl = Auth.getRedirectUrlCookie(event)
			return json({ success: true, redirect: redirectUrl })
		} else {
			throw error(400, 'Verification failed')
		}
	} catch (err) {
		console.error('Authentication error:', err)
		throw error(400, 'Authentication failed')
	}
}
