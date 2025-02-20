import type { Actions, PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
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
	createUnauthenticatedSession,
	attachUserToSession,
	setSessionTokenCookie
} from '$lib/server/auth'

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		console.log(event.locals.user.name)
		console.log(event.locals.user.identifier)
		console.log(event.locals.session.id)
		console.log(event.locals.session.userAgent)
		// redirect(307, '/protected')
	}

	if (!event.locals.session) {
		const sessionToken = generateToken()
		const session = await createUnauthenticatedSession(event, sessionToken)
		setSessionTokenCookie(event, sessionToken, session.expiresAt)
	}

	const form = await superValidate(zod(schema))

	return { form }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(schema))

		if (!form.valid) {
			return fail(400, { form })
		} else {
			// Check if user with email already exists
			const userExists = await db
				.select({
					createdAt: userTable.createdAt
				})
				.from(userTable)
				.where(eq(userTable.identifier, form.data.email))
				.limit(1)

			if (userExists.length > 0) {
				return setError(form, 'User with email already exists')
			} else {
				const newUser: NewUser = {
					name: form.data.name,
					identifier: form.data.email,
					createdAt: new Date(),
					lastSeenAt: new Date(),
					id: randomUUID()
				}
				// Creates the new user
				await db.insert(userTable).values(newUser)

				// Associates the new user with the current session
				await attachUserToSession(event.locals.session.id, newUser.id)
			}
		}

		return message(form, 'User Accepted')
	}
}
