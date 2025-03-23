import type { Actions, ServerLoad } from '@sveltejs/kit'
import { superValidate, setError } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms'
import { fail } from '@sveltejs/kit'

import { setDelay, withDelay } from '$lib/server/auth/utils'

import { emailSchema, loginWithPasswordSchema } from './schema'

export const load: ServerLoad = async () => {
	const emailForm = await superValidate(zod(emailSchema))
	const emailResendForm = await superValidate(zod(emailSchema))
	const loginWithPasswordForm = await superValidate(zod(loginWithPasswordSchema))

	return { emailForm, emailResendForm, loginWithPasswordForm }
}

type CheckEmailMessage = {
	existingUser: boolean | null
	emailAvailable: boolean | null
	emailSentSuccess: boolean | null
	passwordAvailable: boolean | null
	passkeyAvailable: boolean | null
	oauthRequired: boolean | null
}

export const actions: Actions = {
	checkEmail: async ({ request }) => {
		const delayed = setDelay(500)

		const emailForm = await superValidate(request, zod(emailSchema))
		if (!emailForm.valid) return fail(400, { emailForm })

		const existing = emailForm.data.email === 'jake@notnotjake.com'

		const response: CheckEmailMessage = {
			existingUser: existing,
			emailAvailable: true,
			emailSentSuccess: true,
			passwordAvailable: true,
			passkeyAvailable: false,
			oauthRequired: false
		}

		await withDelay(delayed, '')

		return message(emailForm, response)
	},
	resendMagicLink: async ({ request }) => {
		const emailResendForm = await superValidate(request, zod(emailSchema))
		if (!emailResendForm.valid) return fail(400, { emailResendForm })

		const success = true

		if (success) {
			return message(emailResendForm, {
				success: true
			})
		} else {
			return fail(429, {
				emailResendForm,
				message: {
					success: false,
					error: 'Rate Limited'
				}
			})
		}
	}
}
