import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { building } from '$app/environment'
import { env } from '$utils/env/server'
import { applySecurityHeaders } from '$utils/security-headers'
import Auth from '$lib/server/auth'

if (!building) {
	try {
		const validatedEnv = env
		console.log('✅ Startup - Environment variables validated')
	} catch (error) {
		console.error('⚠️ Startup - Environment validation failed:', error)
		// Exit if validation fails during server startup
		process.exit(1)
	}
}

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

	return response
}

export const handle: Handle = sequence(handleAuth, handleSecureHeaders)
