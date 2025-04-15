import type { RequestHandler } from './$types'
import { json, redirect } from '@sveltejs/kit'

import { z } from 'zod'
import Auth from '$lib/server/auth'
import { StructuredResponse as Response } from '$utils/structured-response'
import { setDelay, withDelay } from '$lib/server/auth/utils'

const requestSchema = z.object({
	email: z.string().email(),
	code: z.string()
})

type Data = z.infer<typeof requestSchema>

export const POST: RequestHandler = async (event) => {
	// normalize response times
	const delay = setDelay(500)

	const requestData = await event.request.json()
	const validatedData = requestSchema.safeParse(requestData)

	if (!validatedData.success) return withDelay(delay, Response.fail('Request object invalid - zod'))

	const data: Data = validatedData.data

	if (!event.locals?.session?.id) {
		return withDelay(delay, (Response.fail('No session found'), { status: 500 }))
	}
	const sessionId = event.locals.session.id

	const result = await Auth.verify.withCode({
		identifier: data.email,
		sessionId: sessionId,
		providedCode: data.code
	})

	if (result.success && result.data) {
		await Auth.authenticateSession({ event, userId: result.data.id })

		const redirectUrl = Auth.getRedirectUrlCookie(event) // Get redirect path

		return withDelay(delay, json(Response.succeed(redirectUrl)))
	} else {
		return withDelay(delay, json(Response.fail('Code not accepted')))
	}
}
