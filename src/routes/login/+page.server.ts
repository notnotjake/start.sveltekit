import type { Actions, ServerLoad } from '@sveltejs/kit'
import { superValidate, setError } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms'
import { fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { emailSchema, passwordLoginSchema } from './schema'
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

			const redirectUrl = Auth.consumeRedirectUrl(event) // Get redirect path

			redirect(307, redirectUrl)
		}
	}

	// Instantiate the various forms with superform
	const emailForm = await superValidate(zod(emailSchema))
	const emailResendForm = await superValidate(zod(emailSchema))
	const passwordLoginForm = await superValidate(zod(passwordLoginSchema))

	return { emailForm, emailResendForm, passwordLoginForm }
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
		const maxAgeMins = 5

		if (userExists?.data?.exists && userExists?.data?.user?.id) {
			// returning user

			// todo: need to check their login preferences
			const keysReturned = await Auth.getUserKeysAvailable(userExists.data.user?.id)

			if (!keysReturned.success || !Array.isArray(keysReturned.data))
				return fail(400, { emailForm })

			const keys = new Set(keysReturned.data.map((item) => item.type))

			console.log(keys)

			const emailToken = Auth.generateToken()
			await SendMail.magiclink(
				emailForm.data.email,
				emailToken,
				emailForm.data.timezone || 'UTC',
				maxAgeMins
			)
			await Auth.createAuthAttempt(
				emailForm.data.email,
				event.locals.session.id,
				emailToken,
				maxAgeMins
			)

			const response: CheckEmailMessage = {
				existingUser: false,
				emailAvailable: true,
				emailSentSuccess: true,
				passwordAvailable: keys.has('password'),
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
			await Auth.createAuthAttempt(
				emailForm.data.email,
				event.locals.session.id,
				emailToken,
				maxAgeMins
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
	resendLoginEmail: async (event) => {
		// validate form data
		const emailResendForm = await superValidate(event.request, zod(emailSchema))
		if (!emailResendForm.valid) return fail(400, { emailResendForm })

		// ensure there is a valid session
		if (!event.locals.session) return fail(400, { emailResendForm })

		// check if user exists or it's a new user
		const userExists = await Auth.getUserByIdentifier(emailResendForm.data.email)
		if (!userExists.success) return fail(400, { emailResendForm })

		const emailToken = Auth.generateToken()
		const maxAgeMins = 5

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

		await Auth.createAuthAttempt(
			emailResendForm.data.email,
			event.locals.session.id,
			emailToken,
			maxAgeMins
		)

		return message(emailResendForm, {
			success: true
		})
	},
	passwordLogin: async (event) => {
		// normalize response times
		const delay = setDelay(750)

		const passwordLoginForm = await superValidate(event.request, zod(passwordLoginSchema))
		if (!passwordLoginForm.valid) return fail(400, { passwordLoginForm })

		// ensure there is a valid session
		if (!event.locals.session) return fail(400, { passwordLoginForm })

		// verify email and password
		const result = await Auth.verifyPassword(
			passwordLoginForm.data.email,
			passwordLoginForm.data.password
		)

		if (result.success && result.data) {
			await Auth.authenticateSession(event.locals.session.id, result.data.id)

			const redirectUrl = Auth.consumeRedirectUrl(event) // Get redirect path

			redirect(307, redirectUrl)
		}

		return withDelay(delay, setError(passwordLoginForm, 'password', 'Wrong Password'))
	}
}
