import type { Actions, ServerLoad } from '@sveltejs/kit'
import { fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'

export const load: ServerLoad = async (event) => {
	await Auth.protect.requireRecentAuth(event)

	return {}
}

export const actions: Actions = {
	deleteAccount: async (event) => {
		// delete account
	}
}
