import type { Actions, PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message, setError } from 'sveltekit-superforms'
import { fail } from '@sveltejs/kit'
import { registration as schema } from './schema'

import { Resend } from 'resend'
import { RESEND_API } from '$env/static/private'

import { db } from '$lib/server/db'
import { eq } from 'drizzle-orm'
import { user as userTable } from '$lib/server/db/schema/auth'
import type { NewUser } from '$lib/server/db/schema/auth'
import { randomUUID } from 'crypto'

import {
	generateToken,
	createSession,
	authenticateSession,
	setSessionTokenCookie,
	listAllUserSessions
} from '$lib/server/auth'

import { createAuthAttempt } from '$lib/server/auth/auth-attempt'

export const load: PageServerLoad = async (event) => {
	let allSessions

	if (event.locals.user) {
		// redirect(307, '/protected')
		allSessions = await listAllUserSessions(event.locals.user.id)
	}

	let sessionId: string

	if (!event.locals.session) {
		const sessionToken = generateToken()
		const session = await createSession(event, sessionToken)
		setSessionTokenCookie(event, sessionToken, session.expiresAt)
		sessionId = session.id
	} else {
		sessionId = event.locals.session.id
	}

	const form = await superValidate(zod(schema))

	return { form, sessionId, allSessions }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(schema))

		if (!form.valid) {
			return fail(400, { form })
		} else if (event.locals.session) {
			const emailToken = generateToken()

			const resend = new Resend(RESEND_API)

			await resend.emails.send({
				from: 'LightDance <accounts@resend.notnotjake.com>',
				to: [form.data.email],
				subject: 'Sign In Link',
				html: `<a href="http://localhost:5173/auth/email/verify?token=${emailToken}">Sign In</a>`
			})

			const attempt = await createAuthAttempt(
				form.data.email,
				event.locals.session.id,
				emailToken,
				5
			)
			return message(form, 'Email Sent')
		} else {
			return message(form, 'Error')
		}
	}
}
