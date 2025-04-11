import type { RequestEvent } from '@sveltejs/kit'
import type { Session } from '$lib/server/db/schema/auth'
import { fail, redirect } from '@sveltejs/kit'
import Auth from '$lib/server/auth'

import type { User } from '$lib/server/db/schema/auth'

/**
 * Checks if session has been authenticated in last 15 mins
 * If it hasn't, redirect user to redirects them to step up auth
 */
export async function requireRecentAuth(event: RequestEvent) {
	let session: Session | null = null
	if (event.locals.session) {
		session = event.locals.session
	}

	let recentlyAuthenticated = false
	if (session) {
		recentlyAuthenticated = isSessionRecentlyAuthenticated(session)
	}

	if (!recentlyAuthenticated) {
		Auth.setRedirectUrl(event)
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
		Auth.setRedirectUrl(event)
		const params = new URLSearchParams({
			'reauth-title': 'Welcome Back',
			'reauth-message': `Your login has expired. Log in below`
		})
		redirect(303, `/login?${params.toString()}`)
	}
	return event.locals.user
}

function isSessionRecentlyAuthenticated(session: Session): boolean {
	const authWindow = 15 * 60 * 1000 // 15 mins

	if (!session.lastAuthAt) return false
	const lastAuthAt = session.lastAuthAt.getTime()

	return Date.now() < lastAuthAt + authWindow
}
