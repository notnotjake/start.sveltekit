import type { Actions, ServerLoad } from '@sveltejs/kit'
import { superValidate, setError } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms'
import { fail } from '@sveltejs/kit'

import { emailSchema, loginWithPasswordSchema } from './schema'

export const load: ServerLoad = async () => {
	const emailForm = await superValidate(zod(emailSchema))
	const loginWithPasswordForm = await superValidate(zod(loginWithPasswordSchema))

	return { emailForm, loginWithPasswordForm }
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
		const emailForm = await superValidate(request, zod(emailSchema))

		if (!emailForm.valid) return fail(400, { emailForm })

		return message(emailForm, {
			existingUser: true,
			emailAvailable: true,
			emailSentSuccess: true,
			passwordAvailable: true,
			passkeyAvailable: false,
			oauthRequired: false
		} satisfies CheckEmailMessage)
	}
}
