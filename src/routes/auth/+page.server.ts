import type { Actions, PageServerLoad } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { Resend } from 'resend'
import { RESEND_API } from '$env/static/private'

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
		redirect(307, '/protected')
	}

	if (!event.locals.session) {
		const sessionToken = generateToken()
		const session = await createUnauthenticatedSession(event, sessionToken)
		setSessionTokenCookie(event, sessionToken, session.expiresAt)
	}
}

export const actions: Actions = {
	sendMagicLinkEmail: async () => {
		const resend = new Resend(RESEND_API)

		const { data, error } = await resend.emails.send({
			from: 'LightDance <accounts@resend.notnotjake.com>',
			to: ['jake@lightdance.design'],
			subject: 'Sign In Link',
			html: '<strong>It works!</strong>'
		})

		if (error) {
			return console.error(error)
		}

		console.log(data)
	},
	checkEmail: async (event) => {
		const formData = await event.request.formData()

		const userExists = await db
			.select({ createdAt: userTable.createdAt })
			.from(userTable)
			.where(eq(userTable.identifier, formData.get('email')))
			.limit(1)
	}
}
