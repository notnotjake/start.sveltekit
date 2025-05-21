import type { Actions, ServerLoad } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { enrollTOTP, verifyTOTPCode } from '$lib/server/auth/two-factor'

export const load: ServerLoad = async (event) => {
	const user = await Auth.protect.requireAuthenticatedUser(event)

	await Auth.protect.requireRecentAuth(event)

	return { email: user.identifier }
}

export const actions: Actions = {
	enroll2fa: async (event) => {
		// get and return 2fa enrollment secret
		const newTOTP = enrollTOTP({ userIdentifier: 'test@notnotjake.com' })

		console.log(newTOTP)

		return newTOTP
	},
	verify2faCode: async (event) => {
		const formData = await event.request.formData()

		const providedCode = formData.get('code')

		if (!providedCode) return { success: false }

		const secretKey = 'BPJHX3MZWXLUU6GSAQEHFQOUXJZFEY67'

		const success = verifyTOTPCode({ secretKey, providedCode })
	}
}
