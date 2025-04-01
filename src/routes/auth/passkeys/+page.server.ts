import type { Actions, ServerLoad } from '@sveltejs/kit'
import { fail, redirect } from '@sveltejs/kit'
import { superValidate, setError } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import { message } from 'sveltekit-superforms'

import {
	generateAuthenticationOptions,
	generateRegistrationOptions,
	verifyRegistrationResponse
} from '@simplewebauthn/server'
import Auth from '$lib/server/auth'

const rpID = 'localhost'

const registerFormSchema = z.object({
	email: z.string(),
	name: z.string()
})

export const load: ServerLoad = async () => {
	// const options = await generateAuthenticationOptions({
	// 	rpID,
	// 	userVerification: 'preferred'
	// })

	// return { options }

	const registerForm = await superValidate(zod(registerFormSchema))

	return { registerForm }
}

export const actions: Actions = {
	registerPasskey: async (event) => {
		const registerForm = await superValidate(event.request, zod(registerFormSchema))
		if (!registerForm.valid) return fail(400, { registerForm })

		// ensure there is a valid session
		if (!event.locals.session) return fail(400, { registerForm })

		const options = await generateRegistrationOptions({
			rpName: 'Luxo',
			rpID: 'localhost',
			userName: registerForm.data.email,
			userDisplayName: registerForm.data.name,
			timeout: 60000
		})

		await Auth.createAuthAttempt({
			identifier: registerForm.data.email,
			sessionId: event.locals.session.id,
			token: options.challenge,
			type: 'passkey_register',
			maxAgeMins: 2
		})

		return message(registerForm, { success: true, options })
	}
}
