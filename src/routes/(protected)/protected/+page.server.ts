import type { ServerLoad, Actions } from '@sveltejs/kit'
import { fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'

export const load: ServerLoad = async (event) => {
	const user = await Auth.protect.requireAuthenticatedUser(event)

	return {
		sessionId: event.locals.session?.id,
		userEmail: user.identifier,
		userName: user.name
	}
}

export const actions: Actions = {
	logout: async (event) => {
		if (event.locals.session?.id) {
			const result = await Auth.invalidateSession(event.locals.session.id)

			Auth.clearStepUpReauthCookie(event)
			Auth.clearRedirecctUrl(event)

			if (result.success) {
				redirect(303, '/')
			} else {
				return fail(300, { message: 'Could not log out' })
			}
		} else {
			return fail(300, { message: 'Could not log out' })
		}
	}
}
