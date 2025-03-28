import type { Actions, ServerLoad } from '@sveltejs/kit'
import { superValidate, setError } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms'
import { fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { emailSchema, loginWithPasswordSchema } from './schema'
import { setDelay, withDelay } from '$lib/server/auth/utils'
import { sendMagiclinkEmail } from '$lib/server/email/magic-link'

export const load: ServerLoad = async (event) => {
	// If the user is logged in, redirect to protected route
	if (event.locals.user) {
		redirect(307, '/protected')
	}

	// Ensure there is an unauthenticated session created
	let sessionId: string
	if (!event.locals.session) {
		const sessionToken = Auth.generateToken()
		const session = await Auth.createSession(event, sessionToken)
		Auth.setSessionTokenCookie(event, sessionToken, session.expiresAt)
		sessionId = session.id
	} else {
		sessionId = event.locals.session.id
	}

	// Validate magic link
	const token = event.url.searchParams.get('magic')
	let identifier = null
	if (token && sessionId) {
		const result = await Auth.verifyAuthAttempt(token, sessionId)
		if (result) {
			await Auth.authenticateSession(sessionId, result.id)
			event.locals.user = result
			redirect(307, '/protected')
		}
	}

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
	checkEmail: async (event) => {
		const delay = setDelay(500)

		const emailForm = await superValidate(event.request, zod(emailSchema))
		if (!emailForm.valid) return fail(400, { emailForm })

		if (!event.locals.session) return fail(400, { emailForm })

		const userExists = await Auth.getUserByIdentifier(emailForm.data.email)
		if (userExists) {
			const emailToken = Auth.generateToken()
			await sendMagiclinkEmail(emailForm.data.email, emailToken)
			const attempt = await Auth.createAuthAttempt(
				emailForm.data.email,
				event.locals.session.id,
				emailToken,
				5
			)

			const response: CheckEmailMessage = {
				existingUser: false,
				emailAvailable: true,
				emailSentSuccess: true,
				passwordAvailable: false,
				passkeyAvailable: false,
				oauthRequired: false
			}

			await withDelay(delay, '')

			return message(emailForm, response)
		} else {
			const emailToken = Auth.generateToken()
			await sendMagiclinkEmail(emailForm.data.email, emailToken)
			const attempt = await Auth.createAuthAttempt(
				emailForm.data.email,
				event.locals.session.id,
				emailToken,
				5
			)

			const response: CheckEmailMessage = {
				existingUser: false,
				emailAvailable: true,
				emailSentSuccess: true,
				passwordAvailable: false,
				passkeyAvailable: false,
				oauthRequired: false
			}

			return withDelay(delay, message(emailForm, response))
		}
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
