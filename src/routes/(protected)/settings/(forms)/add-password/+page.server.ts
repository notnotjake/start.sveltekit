import type { Actions, ServerLoad } from '@sveltejs/kit'
import { superValidate, setError } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms'
import { fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { passwordSchema as schema } from './schema'

export const load: ServerLoad = async (event) => {
	const user = await Auth.protect.requireAuthenticatedUser(event)

	await Auth.protect.requireRecentAuth(event)

	// If user already has password, redirect to change-password
	const userKeys = await Auth.getUserKeysAvailable(user.id)
	if (!userKeys.success || !userKeys.data) return fail(400)

	if (userKeys.data.has('password')) {
		redirect(303, '/settings/change-password')
	}

	const addPasswordForm = await superValidate(zod(schema))

	return { addPasswordForm, email: user.identifier }
}

export const actions: Actions = {
	addPassword: async (event) => {
		// validate form data
		const addPasswordForm = await superValidate(event.request, zod(schema))
		if (!addPasswordForm.valid) return fail(400, { addPasswordForm })

		await Auth.protect.requireRecentAuth(event)
		const user = await Auth.protect.requireAuthenticatedUser(event)

		const result = await Auth.addPassword({
			identifier: user.identifier,
			password: addPasswordForm.data.password
		})
		console.log(result)

		if (!result.success) return fail(400, { addPasswordForm })

		const response = {
			success: true
		}

		return message(addPasswordForm, response)
	}
}
