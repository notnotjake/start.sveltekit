import type { Actions, ServerLoad } from '@sveltejs/kit'
import { superValidate, setError } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms'
import { fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { emailSchema, loginWithPasswordSchema } from './schema'
import { setDelay, withDelay } from '$lib/server/auth/utils'
import SendMail from '$lib/server/email'

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
		const delay = setDelay(500) // normalize response times

		// validate form data
		const emailForm = await superValidate(event.request, zod(emailSchema))
		if (!emailForm.valid) return fail(400, { emailForm })

		// ensure there is a valid session
		if (!event.locals.session) return fail(400, { emailForm })

		// check if a user already exists associated with the submitted email/identifier
		const userExists = await Auth.getUserByIdentifier(emailForm.data.email)

		if (!userExists.success) return fail(400, { emailForm })

		// Default maxAgeMins to 5 minutes
		const maxAgeMins = 5;
		
		if (userExists?.data?.exists) {
			// returning user

			// todo: need to check their login preferences

			const emailToken = Auth.generateToken()
			await SendMail.magiclink(
				emailForm.data.email, 
				emailToken, 
				emailForm.data.timezone || 'UTC',
				maxAgeMins
			)
			await Auth.createAuthAttempt(emailForm.data.email, event.locals.session.id, emailToken, maxAgeMins)

			const response: CheckEmailMessage = {
				existingUser: false,
				emailAvailable: true,
				emailSentSuccess: true,
				passwordAvailable: false,
				passkeyAvailable: false,
				oauthRequired: false
			}

			return withDelay(delay, message(emailForm, response))
		} else {
			// new user
			const emailToken = Auth.generateToken()
			await SendMail.register(
				emailForm.data.email, 
				emailToken,
				emailForm.data.timezone || 'UTC',
				maxAgeMins
			)
			await Auth.createAuthAttempt(emailForm.data.email, event.locals.session.id, emailToken, maxAgeMins)

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
	resendMagicLink: async (event) => {
		// validate form data
		const emailResendForm = await superValidate(event.request, zod(emailSchema))
		if (!emailResendForm.valid) return fail(400, { emailResendForm })

		// ensure there is a valid session
		if (!event.locals.session) return fail(400, { emailResendForm })

		// check if user exists or it's a new user
		const userExists = await Auth.getUserByIdentifier(emailResendForm.data.email)
		if (!userExists.success) return fail(400, { emailResendForm })

		const emailToken = Auth.generateToken()
		const maxAgeMins = 5;

		if (userExists?.data?.exists) {
			// returning user
			await SendMail.magiclink(
				emailResendForm.data.email, 
				emailToken,
				emailResendForm.data.timezone || 'UTC',
				maxAgeMins
			)
		} else {
			// new user
			await SendMail.register(
				emailResendForm.data.email, 
				emailToken,
				emailResendForm.data.timezone || 'UTC',
				maxAgeMins
			)
		}

		await Auth.createAuthAttempt(emailResendForm.data.email, event.locals.session.id, emailToken, maxAgeMins)

		return message(emailResendForm, {
			success: true
		})
	}
}
