import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
// import { applySecurityHeaders } from '$utils/security-headers'
import Auth from '$lib/server/auth'

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = Auth.getSessionTokenCookie(event)

	// If there is no cookie, set user and session to null value
	if (!sessionToken) {
		event.locals.user = null
		event.locals.session = null
		return resolve(event)
	}

	// Otherwise, validate the session cookie
	const { session, user } = await Auth.validateSessionToken(sessionToken)
	if (session) {
		// And reset the cookie with new expiration
		Auth.setSessionTokenCookie(event, sessionToken, session.expiresAt)
	} else {
		// Otherwise, delete the existing cookie
		Auth.deleteSessionTokenCookie(event)
	}

	// Return the user and session if they were verified or null
	event.locals.user = user
	event.locals.session = session

	return resolve(event)
}

const handleSecureHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event)

	// would use handle secure headers here

	return response
}

export const handle: Handle = sequence(handleAuth, handleSecureHeaders)
