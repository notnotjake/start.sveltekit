import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { building } from '$app/environment'
import { env } from '$utils/env/server'
import { applySecurityHeaders } from '$utils/security-headers'
import * as auth from '$lib/server/auth'

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
	const sessionToken = event.cookies.get(auth.sessionCookieName) ?? null

	if (!sessionToken) {
		event.locals.user = null
		event.locals.session = null
		return resolve(event)
	}

	const { session, user } = await auth.validateSessionToken(sessionToken)
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt)
	} else {
		auth.deleteSessionTokenCookie(event)
	}

	event.locals.user = user
	event.locals.session = session

	return resolve(event)
}

const handleSecureHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event)

	if (event.url.pathname.startsWith('/admin')) {
		applySecurityHeaders(response)
	}

	return response
}

export const handle: Handle = sequence(handleAuth, handleSecureHeaders)
