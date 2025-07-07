import { env } from '$env/dynamic/public'
import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { verifyRegistrationResponse } from '@simplewebauthn/server'

const expectedOrigin = env.PUBLIC_URL_BASE || 'http://localhost:5173'
const expectedRPID = env.PUBLIC_URL_ID || 'localhost'

export const POST: RequestHandler = async (event) => {
	try {
		if (!event.locals.session) {
			console.error('Passkey registration: No session found')
			return json({ success: false, message: 'No session found' }, { status: 400 })
		}

		const body = await event.request.json()
		const { registrationResponse, name } = body

		if (!registrationResponse) {
			console.error('Passkey registration: Missing registration response')
			return json({ success: false, message: 'Missing registration response' }, { status: 400 })
		}

		console.log('Passkey registration: Getting auth attempt for session:', event.locals.session.id)
		const authAttemptResult = await Auth.getAuthAttempt({
			sessionId: event.locals.session.id,
			type: 'passkey_register'
		})

		if (!authAttemptResult.success || !authAttemptResult.data?.credential) {
			console.error('Passkey registration: Invalid auth attempt', authAttemptResult)
			return json({ success: false, message: 'Invalid auth attempt' })
		}

		const { credential: challenge } = authAttemptResult.data

		console.log('Passkey registration: Verifying registration response')
		console.log('Expected origin:', expectedOrigin)
		console.log('Expected RPID:', expectedRPID)

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
				console.error('Passkey registration: Missing required data', { userId, passkeyId, hasCredential: !!credential })
				return json({ success: false, message: 'Missing required registration data' }, { status: 400 })
			}

			console.log('Passkey registration: Adding passkey to database')
			const addResult = await Auth.addPasskey({
				userId,
				passkeyId,
				credential,
				name
			})

			if (!addResult.success) {
				console.error('Passkey registration: Failed to add passkey', addResult)
				return json({ success: false, message: 'Failed to save passkey' })
			}

			console.log('Passkey registration: Success')
			return json({ success: true, message: 'Passkey registered successfully' })
		} else {
			console.error('Passkey registration: Verification failed', attempt)
			return json({ success: false, message: 'Verification failed' })
		}
	} catch (err) {
		console.error('Passkey registration: Unexpected error', err)
		return json({ success: false, message: 'Internal server error' }, { status: 500 })
	}
}
