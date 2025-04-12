import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import { StructuredResponse as Response } from '$utils/structured-response'

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) return json(Response.fail())

	const tryLogout = await Auth.invalidateSession(event.locals.session.id)

	if (!tryLogout.success) return json(Response.fail())

	Auth.clearStepUpReauthCookie(event)
	Auth.clearRedirectUrlCookie(event)
	Auth.deleteSessionTokenCookie(event)

	return json(Response.succeed())
}
