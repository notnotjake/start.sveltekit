import type { Actions, ServerLoad } from '@sveltejs/kit'
import { superValidate, setError } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms'
import { fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { passwordSchema } from './schema'
import { setDelay, withDelay } from '$lib/server/auth/utils'

export const load: ServerLoad = async (event) => {
	const user = await Auth.protect.requireAuthenticatedUser(event)

	await Auth.protect.requireRecentAuth(event)

	const addPasswordForm = await superValidate(zod(passwordSchema))

	return { addPasswordForm, email: user.identifier }
}

export const actions: Actions = {
	addPassword: async (event) => {
		const delay = setDelay(900)

		// validate form data
		const addPasswordForm = await superValidate(event.request, zod(passwordSchema))
		if (!addPasswordForm.valid) return fail(400, { addPasswordForm })

		// ensure there is a valid session
		if (!event.locals.session || !event.locals.user) return fail(400, { addPasswordForm })

		console.log(addPasswordForm.data.password)

		const response = {
			success: true
		}

		return withDelay(delay, message(addPasswordForm, response))
	}
}
