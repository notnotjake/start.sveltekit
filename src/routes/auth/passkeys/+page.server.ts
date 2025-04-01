import type { Actions, ServerLoad } from '@sveltejs/kit'
import { fail, redirect } from '@sveltejs/kit'

import { generateAuthenticationOptions, generateRegistrationOptions } from '@simplewebauthn/server'
import Auth from '$lib/server/auth'

const rpID = 'localhost'

export const load: ServerLoad = async () => {
	// const options = await generateAuthenticationOptions({
	// 	rpID,
	// 	userVerification: 'preferred'
	// })

	// return { options }
	return {}
}

export const actions: Actions = {
	registerPasskey: async (event) => {
		const formData = await event.request.formData()

		const email = formData.get('email')?.toString() || ''
		const name = formData.get('name')?.toString() || ''

		if (!email || !name) return fail(400)

		const options = await generateRegistrationOptions({
			rpName: 'Luxo',
			rpID,
			userName: email,
			userDisplayName: name,
			timeout: 60000
		})

		const challenge = options.challenge
		console.log(challenge) // should store on session

		return { options }
	}
}
