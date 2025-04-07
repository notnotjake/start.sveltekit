import type { ServerLoad, Actions } from '@sveltejs/kit'
import { fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'

export const load: ServerLoad = async (event) => {
	if (!event.locals.user) {
		Auth.setRedirectUrl(event)
		redirect(307, '/login')
	}

	return {
		sessionId: event.locals.session?.id,
		userEmail: event.locals.user?.identifier,
		userName: event.locals.user?.name
	}
}

export const actions: Actions = {
	logout: async (event) => {
		if (event.locals.session?.id) {
			const result = await Auth.invalidateSession(event.locals.session.id)

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
