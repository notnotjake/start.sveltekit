import { createSession, generateSessionToken } from '$lib/server/auth/sessions'

import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
	const token = generateSessionToken()
	const session = createSession(token, 1)
	// setSessionTokenCookie(token)

	return {
		token,
		session
	}
}
