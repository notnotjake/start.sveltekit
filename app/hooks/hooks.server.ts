import type { Handle } from '@sveltejs/kit'
import { env } from '$utils/env/server'
import { building } from '$app/environment'
// import { validate } from 'envv'

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
	return await resolve(event)
}
