import type { RequestHandler } from './$types'
import { json, fail, redirect } from '@sveltejs/kit'

import { z } from 'zod'
import Auth from '$lib/server/auth'
import { StructuredResponse as Response } from '$utils/structured-response'
import { setDelay, withDelay } from '$lib/server/auth/utils'

const requestSchema = z.object({
	email: z.string().email(),
	timezone: z.string()
})

type Data = z.infer<typeof requestSchema>

export const POST: RequestHandler = async ({ locals, request }) => {
	try {
		const requestData = await request.json()
		const validatedData = requestSchema.safeParse(requestData)

		if (!validatedData.success) return json(Response.fail('Request object invalid - zod'))

		const data: Data = validatedData.data

		if (!locals?.session?.id) {
			return json(Response.fail('No session found'), { status: 500 })
		}
		const sessionId = locals.session.id

		// Check if user exists
		const userRequest = await Auth.getUserByIdentifier(data.email)

		if (!userRequest.success || !userRequest.data) {
			return json(Response.fail('Failed to get user'), { status: 500 })
		}

		const existingUser = userRequest.data.exists

		const response = await Auth.sendMagiclink({
			email: data.email,
			sessionId: sessionId,
			type: existingUser ? 'login' : 'register',
			timezone: data.timezone
		})

		if (response.success) {
			return json(Response.succeed())
		} else {
			return json(Response.fail('Failed to send email'), { status: 500 })
		}
	} catch (e) {
		return json(Response.fail('An unexpected error occurred'), { status: 400 })
	}
}
