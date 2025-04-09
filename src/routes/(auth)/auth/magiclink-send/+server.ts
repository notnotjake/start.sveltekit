import type { RequestHandler } from './$types'
import { json, fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'
import Email from '$lib/server/email'

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json()

	// Validate required fields
	if (!data.email || !data.sessionId || !data.type || !data.timezone) {
		return json({ success: false, error: 'Missing required fields' }, { status: 400 })
	}

	const sessionId = data.sessionId
	const email = data.email.toLowerCase()
	const type = data.type // 'login' or 'register'
	const timezone = data.timezone || 'UTC'

	const existingUser = false

	const response = await Auth.sendMagiclink({
		email,
		sessionId,
		type: existingUser ? 'login' : 'register',
		timezone
	})

	if (response.success) {
		return json({ success: false, data: null }, { status: 500 })
	} else {
		return json({ success: true, data: null })
	}
}
