import type { Actions, ServerLoad } from '@sveltejs/kit'
import { superValidate, setError } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms'
import { fail, json } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { changeEmailSchema, confirmEmailCodeSchema } from './schema'

export const load: ServerLoad = async (event) => {
	const user = await Auth.protect.requireAuthenticatedUser(event)

	await Auth.protect.requireRecentAuth(event)

	const changeEmailForm = await superValidate(zod(changeEmailSchema))
	const confirmCodeForm = await superValidate(zod(confirmEmailCodeSchema))

	return { changeEmailForm, confirmCodeForm, currentEmail: user.identifier }
}

export const actions: Actions = {
	changeEmail: async (event) => {
		const form = await superValidate(event.request, zod(changeEmailSchema))

		if (!form.valid) return fail(400, { form })

		await Auth.protect.requireRecentAuth(event)

		if (!event.locals.session.id) return fail(400, { form })

		const result = await Auth.requestUpdateUserIdentifier({
			sessionId: event.locals.session.id,
			newIdentifier: form.data.newEmail as string,
			timezone: (form.data.timezone as string) || 'UTC'
		})

		if (!result.success) return setError(form, 'newEmail', 'Email Not Available')

		const response = {
			success: true
		}

		return message(form, response)
	},
	confirmNewEmail: async (event) => {
		const form = await superValidate(event.request, zod(confirmEmailCodeSchema))

		if (!form.valid) return fail(400, { form })

		await Auth.protect.requireRecentAuth(event)

		if (!event.locals.session?.id || !event.locals.user?.id) {
			return setError(form, '', 'Session expired, please try again')
		}

		// we want to check the code with auth attempt
		const result = await Auth.confirmUpdateUserIdentifier({
			user: event.locals.user,
			sessionId: event.locals.session.id,
			code: form.data.code
		})

		console.log(result)

		if (!result.success) {
			return setError(form, 'code', 'Invalid code or code expired')
		}

		const response = {
			success: true
		}

		return message(form, response)
	}
}
