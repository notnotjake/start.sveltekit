import { createSession, generateSessionToken } from '$lib/server/auth/sessions'

import { fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const token = generateSessionToken()
	const session = createSession(token, 1)
	// setSessionTokenCookie(token)

	const isAuthenticated = event.locals.user === null ? 'no' : 'yes'

	return {
		token,
		session,
		isAuthenticated
	}
}
