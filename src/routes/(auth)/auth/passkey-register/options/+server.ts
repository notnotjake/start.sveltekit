import { env } from '$env/dynamic/public'
import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { generateRegistrationOptions } from '@simplewebauthn/server'

const rpID = env.PUBLIC_URL_ID || 'localhost'
const rpName = env.PUBLIC_SITE_NAME || 'Example'

export const POST: RequestHandler = async (event) => {
	try {
		console.log('Passkey registration options: Starting')
		console.log('RPID:', rpID)
		console.log('RPName:', rpName)

		await Auth.protect.requireRecentAuth(event)

		const session = await Auth.protect.requireSession(event)
		const user = await Auth.protect.requireAuthenticatedUser(event)

		console.log('Passkey registration options: User authenticated', { userId: user.id, identifier: user.identifier })

		const options = await generateRegistrationOptions({
			rpName,
			rpID,
			timeout: 60000,
			userName: user.identifier,
			userDisplayName: user.name || ''
		})

		console.log('Passkey registration options: Generated options', { challenge: options.challenge })

		await Auth.createAuthAttempt({
			identifier: user.identifier,
			sessionId: session.id,
			token: options.challenge,
			type: 'passkey_register',
			maxAgeMins: 2
		})

		console.log('Passkey registration options: Auth attempt created')

		return json({ success: true, data: { options } })
	} catch (err) {
		console.error('Passkey registration options: Error', err)
		return json({ success: false, message: 'Failed to generate registration options' }, { status: 500 })
	}
}
