import type { Actions, ServerLoad } from '@sveltejs/kit'
import { superValidate, setError } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms'
import { fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { changePasswordSchema as schema } from './schema'

export const load: ServerLoad = async (event) => {
	const user = await Auth.protect.requireAuthenticatedUser(event)

	await Auth.protect.requireRecentAuth(event)

	// If user has no password, redirect to add-password
	const userKeys = await Auth.getUserKeysAvailable(user.id)
	if (!userKeys.success || !userKeys.data) return fail(400)

	if (!userKeys.data.has('password')) {
		redirect(303, '/settings/add-password')
	}

	const changePasswordForm = await superValidate(zod(schema))

	return { changePasswordForm, email: user.identifier }
}

export const actions: Actions = {
	changePassword: async (event) => {
		// validate form data
		const changePasswordForm = await superValidate(event.request, zod(schema))
		if (!changePasswordForm.valid) return fail(400, { changePasswordForm })

		const user = await Auth.protect.requireAuthenticatedUser(event)

		const result = await Auth.updatePassword({
			identifier: user.identifier,
			currentPassword: changePasswordForm.data.currentPassword,
			newPassword: changePasswordForm.data.newPassword
		})

		if (!result.success) {
			if (result?.error === 'No current password found') {
				redirect(303, 'add-password')
			} else if (result?.error === 'Password not accepted') {
				return setError(changePasswordForm, 'currentPassword', 'Incorrect')
			} else {
				return setError(changePasswordForm, 'Failed to update password')
			}
		}

		const response = {
			success: true
		}

		return message(changePasswordForm, response)
	}
}
