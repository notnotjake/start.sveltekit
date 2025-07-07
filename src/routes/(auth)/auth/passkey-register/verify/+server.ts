import { env } from '$env/dynamic/public'
import type { RequestHandler } from './$types'
import { json, fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { verifyRegistrationResponse } from '@simplewebauthn/server'

const expectedOrigin = env.PUBLIC_URL_BASE || 'http://localhost:5173'
const expectedRPID = env.PUBLIC_URL_ID || 'localhost'

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) return fail(400)

	const body = await event.request.json()

	const { registrationResponse, name } = body

	const authAttemptResult = await Auth.getAuthAttempt({
		sessionId: event.locals.session.id,
		type: 'passkey_register'
	})

	if (!authAttemptResult.success || !authAttemptResult.data?.credential) {
		return json({ success: false, message: 'PVerification failed' })
	}

	const { credential: challenge } = authAttemptResult.data

	const attempt = await verifyRegistrationResponse({
		response: registrationResponse,
		expectedChallenge: challenge,
		expectedOrigin,
		expectedRPID,
		requireUserVerification: true
	})

	if (attempt.verified) {
		const userId = event.locals.user?.id
		const passkeyId = attempt.registrationInfo?.credential.id
		const credential = attempt.registrationInfo?.credential.publicKey

		if (!userId || !passkeyId || !credential) {
			return fail(400)
		}

		await Auth.addPasskey({
			userId,
			passkeyId,
			credential,
			name
		})

		return json({ success: true, message: 'Passkey registered successfully' })
	} else {
		return json({ success: false, message: 'PVerification failed' })
	}
}
