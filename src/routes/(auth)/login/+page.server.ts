import type { Actions, ServerLoad } from '@sveltejs/kit'
import { superValidate, setError } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms'
import { fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { emailSchema, passwordLoginSchema } from './schema'
import { setDelay, withDelay } from '$lib/server/auth/utils'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
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

	let passkeyAuto = true

	// Validate magic link
	const token = event.url.searchParams.get('magic')
	let magicStatus = ''
	if (token && sessionId) {
		let passkeyAuto = false

		const result = await Auth.verify.withEmail({ token, sessionId })
		console.log(result)

		if (!result.success) {
			if (result.error === 'invalid token') {
				// TODO: display message to user that token has expired
				magicStatus = 'invalid token'
			} else {
				// TODO: display error message
				console.log(result.error)
				magicStatus = 'error'
			}
		} else if (result.data && result.data.user) {
			await Auth.authenticateSession(sessionId, result.data.user.id)
			const redirectUrl = Auth.consumeRedirectUrl(event)
			redirect(307, redirectUrl)
		} else if (result.data && result.data.code) {
			// TODO: need to show the code on the page with UI
			magicStatus = result.data.code
		}
	}

	// Instantiate the various forms with superform
	const emailForm = await superValidate(zod(emailSchema))
	const emailResendForm = await superValidate(zod(emailSchema))
	const passwordLoginForm = await superValidate(zod(passwordLoginSchema))

	return { emailForm, emailResendForm, passwordLoginForm, magicStatus, passkeyAuto }
}

type FindUserMessage = {
	existingUser: boolean | null
	emailAvailable: boolean | null
	emailSentSuccess: boolean | null
	passwordAvailable: boolean | null
	passkeyAvailable: boolean | null
	oauthRequired: boolean | null
}

export const actions: Actions = {
	startLogin: async (event) => {
		const delay = setDelay(500) // normalize response times

		// validate form data
		const emailForm = await superValidate(event.request, zod(emailSchema))
		if (!emailForm.valid) return fail(400, { emailForm })
		// ensure there is a valid session
		if (!event.locals.session) return fail(400, { emailForm })

		// change email to lowercase
		emailForm.data.email = emailForm.data.email.toLowerCase()

		// check if a user exists
		const userExistsRequest = await Auth.getUserByIdentifier(emailForm.data.email)
		if (!userExistsRequest.success) return fail(400, { emailForm })

		// Default Values
		let existingUser = false
		let passwordAvailable = false
		let passkeyAvailable = false
		let sendLoginEmail = false
		let emailSentSuccess = false

		if (userExistsRequest?.data?.exists && userExistsRequest?.data?.user?.id) {
			existingUser = true

			const keysReturned = await Auth.getUserKeysAvailable(userExistsRequest.data.user.id)
			if (!keysReturned.success || !keysReturned.data) return fail(400, { emailForm })

			const keys = keysReturned.data
			passwordAvailable = keys.has('password')
			passkeyAvailable = keys.has('passkey')

			if (!passwordAvailable && !passkeyAvailable) {
				sendLoginEmail = true
			}
		} else {
			sendLoginEmail = true
		}

		if (sendLoginEmail) {
			const response = await Auth.sendMagiclink({
				email: emailForm.data.email,
				sessionId: event.locals.session.id,
				type: existingUser ? 'login' : 'register',
				timezone: emailForm.data.timezone || 'UTC'
			})

			emailSentSuccess = response.success
		}

		const response: FindUserMessage = {
			existingUser,
			emailAvailable: true,
			emailSentSuccess,
			passwordAvailable,
			passkeyAvailable,
			oauthRequired: false
		}

		return withDelay(delay, message(emailForm, response))
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
