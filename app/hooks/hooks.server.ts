// import { env } from '../../env'
import type { Handle } from '@sveltejs/kit'
import { env } from '$lib/env/private'
import { building } from '$app/environment'

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
