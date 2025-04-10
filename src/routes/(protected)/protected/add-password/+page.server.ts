import type { Actions, ServerLoad } from '@sveltejs/kit'
import { superValidate, setError } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms'
import { fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { passwordSchema } from './schema'

export const load: ServerLoad = async (event) => {
	if (!event.locals.user || !event.locals.session) {
		Auth.setRedirectUrl(event)
		const params = new URLSearchParams({
			'reauth-title': 'Welcome Back',
			'reauth-message': `Your login expired. Log in below`
		})
		redirect(303, `/login?${params.toString()}`)
	}

	const recentlyAuthenticated = Auth.isSessionRecentlyAuthenticated(event.locals.session)
	if (!recentlyAuthenticated) {
		Auth.setRedirectUrl(event)
		const params = new URLSearchParams({
			'reauth-title': 'Verification Required',
			'reauth-message': 'This action requires you authenticate again'
		})
		redirect(303, `/login?${params.toString()}`)
	}

	const addPasswordForm = await superValidate(zod(passwordSchema))

	return { addPasswordForm, email: event.locals.user.identifier }
}

export const actions: Actions = {
	addPassword: async (event) => {
		// validate form data
		const addPasswordForm = await superValidate(event.request, zod(passwordSchema))
		if (!addPasswordForm.valid) return fail(400, { addPasswordForm })

		// ensure there is a valid session
		if (!event.locals.session || !event.locals.user) return fail(400, { addPasswordForm })

		const response = {
			success: true
		}

		return message(addPasswordForm, response)
	}
}
