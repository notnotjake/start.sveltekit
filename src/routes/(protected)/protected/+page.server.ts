import type { ServerLoad } from '@sveltejs/kit'

import Auth from '$lib/server/auth'

export const load: ServerLoad = async (event) => {
	const user = await Auth.protect.requireAuthenticatedUser(event)

	return {
		sessionId: event.locals.session?.id,
		userEmail: user.identifier,
		userName: user.name
	}
}
