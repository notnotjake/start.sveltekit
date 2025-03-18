import type { Actions, ServerLoad } from '@sveltejs/kit'
import { superValidate, setError } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms'
import { fail } from '@sveltejs/kit'

import { emailSchema, passwordSchema } from './schema'

import { getUserByIdentifier } from '$lib/server/auth/users'

export const load: ServerLoad = async () => {
	const emailForm = await superValidate(zod(emailSchema))
	const passwordForm = await superValidate(zod(passwordSchema))

	return { emailForm, passwordForm }
}

export const actions: Actions = {
	checkEmail: async ({ request }) => {
		const emailForm = await superValidate(request, zod(emailSchema))
		if (!emailForm.valid) return fail(400, { emailForm })

		const foundUser = await getUserByIdentifier(emailForm.data.email)

		console.log('Found User: ', foundUser)

		if (!foundUser) {
			return message(emailForm, {
				nextStep: 'newUser',
				text: 'Check email to register account'
			})
		}

		return message(emailForm, {
			nextStep: 'returningUser',
			text: 'Login'
		})
	},
	checkPassword: async ({ request }) => {
		const passwordForm = await superValidate(request, zod(passwordSchema))

		if (!passwordForm.valid) return fail(400, { passwordForm })

		return message(passwordForm, 'Success')
	}
}
