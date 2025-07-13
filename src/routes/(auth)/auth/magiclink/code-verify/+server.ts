import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'

import { z } from 'zod'
import Auth from '$lib/server/auth'
import { StructuredResponse as Response } from '$utils/structured-response'

const requestSchema = z.object({
	email: z.string().email(),
	code: z.string()
})

type Data = z.infer<typeof requestSchema>

export const POST: RequestHandler = async (event) => {
	const requestData = await event.request.json()
	const validatedData = requestSchema.safeParse(requestData)

	if (!validatedData.success) {
		return json(Response.fail('Request invalid'))
	}

	const data: Data = validatedData.data

	if (!event.locals?.session?.id) {
		return json(Response.fail('No session found'))
	}

	const sessionId = event.locals.session.id

	const result = await Auth.verify.withCode({
		identifier: data.email,
		sessionId: sessionId,
		providedCode: data.code
	})

	if (result.success && result.data) {
		await Auth.authenticateSession({ event, user: result.data })
		const redirectUrl = Auth.getRedirectUrlCookie(event) // Get redirect path

		return json(Response.succeed(redirectUrl))
	} else {
		return json(Response.fail('Code not accepted'))
	}
}
