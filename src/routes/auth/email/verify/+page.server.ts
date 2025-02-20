import type { Actions, PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message, setError } from 'sveltekit-superforms'
import { fail } from '@sveltejs/kit'
import { registration as schema } from './schema'

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

import { verifyAuthAttempt } from '$lib/server/auth/auth-attempt'

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(zod(schema))

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

	const token = event.url.searchParams.get('token')
	let identifier = null
	if (token && sessionId) {
		const result = await verifyAuthAttempt(token, sessionId)
		if (result) {
			identifier = result
		}
	}

	return { form, sessionId, allSessions, identifier }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(schema))

		if (!form.valid) {
			return fail(400, { form })
		} else {
			const result = await verifyAuthAttempt(form.data.token, event.locals.session.id)
			console.log('Returned', result)
		}
		return message(form, 'Email Sent')
	}
}
