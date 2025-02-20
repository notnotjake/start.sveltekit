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
		} else {
			const [userId] = await db
				.select({ userId: userTable.id })
				.from(userTable)
				.where(eq(userTable.identifier, form.data.email))
				.limit(1)

			console.log(userId, event.locals.session)

			if (userId) {
				// Authenticate Session
				authenticateSession(event.locals.session.id, userId.userId)
			} else {
				return setError(form, 'No user exists')
			}
		}
		return message(form, 'Logged in')
	}
}
