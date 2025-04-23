import type { RequestEvent } from '@sveltejs/kit'
import type { User, Session } from '$lib/server/db/schema/auth'
import { redirect } from '@sveltejs/kit'
import Auth from '$lib/server/auth'

/**
 * Checks if session has been authenticated in last 15 mins
 * If it hasn't, redirect user to redirects them to step up auth
 */
export async function requireRecentAuth(event: RequestEvent) {
	const AUTH_WINDOW = 0.5 * 60 * 1000 // 15 mins

	let session: Session | null = null
	if (event.locals.session) {
		session = event.locals.session
	}

	let recentlyAuthenticated = false
	if (session) {
		if (!session.lastAuthAt) return false

		const lastAuthAt = session.lastAuthAt.getTime()

		recentlyAuthenticated = Date.now() < lastAuthAt + AUTH_WINDOW
	}

	if (!recentlyAuthenticated) {
		Auth.setRedirectUrlCookie(event)
		Auth.setStepUpReauthCookie(event)

		const params = new URLSearchParams({
			'reauth-title': 'Verification Required',
			'reauth-message': 'This action requires you authenticate again'
		})

		redirect(303, `/login?${params.toString()}`)
	} else {
		return
	}
}

/**
 * Ensures that the user is authenticated before proceeding with the request.
 * If the user is not authenticated, redirects them to the login page
 */
export async function requireAuthenticatedUser(event: RequestEvent): Promise<User> {
	if (!event.locals.user || !event.locals.session) {
		Auth.setRedirectUrlCookie(event)
		const params = new URLSearchParams({
			'reauth-title': 'Welcome Back',
			'reauth-message': `Your login has expired. Log in below`
		})
		redirect(303, `/login?${params.toString()}`)
	}
	return event.locals.user
}

/**
 * Ensures that a session is attached to the event or creates one.
 * Only checks that there is an unauthenticated session and does not check
 * for a user attached to session or event.
 *
 * Will create a new unauthenticated session if one doesn't exist
 */
export async function requireSession(event: RequestEvent): Promise<Session> {
	if (!event.locals.session) {
		const createSessionResult = await Auth.createUnauthenticatedSession(event)
		if (!createSessionResult.success || !createSessionResult.data) {
			console.error(createSessionResult.error)
			throw Error
		}

		const { rawSessionToken, session } = createSessionResult.data

		Auth.setSessionTokenCookie(event, rawSessionToken, session.expiresAt)
		return session
	} else {
		return event.locals.session
	}
}
