import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { building } from '$app/environment'
import { env } from '$utils/env/server'

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

const handleStep: Handle = async ({ event, resolve }) => {
	return resolve(event)
}

export const handle: Handle = sequence(handleStep)
