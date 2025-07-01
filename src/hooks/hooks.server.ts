import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
// import { applySecurityHeaders } from '$utils/security-headers'
// import Auth from '$lib/server/auth'
import { authHandler } from '$lib/server/auth'

// const handleSecureHeaders: Handle = async ({ event, resolve }) => {
// 	const response = await resolve(event)
//
// 	return response
// }

export const handle: Handle = sequence(authHandler)
