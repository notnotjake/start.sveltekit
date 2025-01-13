import type { Handle } from '@sveltejs/kit'
import { building } from '$app/environment'
import { env } from '$utils/env/server'
import { applySecurityHeaders } from '$utils/security-headers'

if (!building) {
	try {
		const validatedEnv = env
		console.log('✅ Startup - Environment variables validated')
	} catch (error) {
		console.error('⚠️ Startup - Environment validation failed:', error)
		// Exit if validation fails during server startup
		process.exit(1)
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event)

	if (event.url.pathname.startsWith('/admin')) {
		applySecurityHeaders(response)
	}

	return response
}
