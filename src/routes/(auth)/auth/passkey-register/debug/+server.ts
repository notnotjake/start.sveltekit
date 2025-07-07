import { env } from '$env/dynamic/public'
import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'

export const GET: RequestHandler = async (event) => {
	const debugInfo = {
		expectedOrigin: env.PUBLIC_URL_BASE || 'http://localhost:5173',
		expectedRPID: env.PUBLIC_URL_ID || 'localhost',
		hasSession: !!event.locals.session,
		sessionId: event.locals.session?.id,
		hasUser: !!event.locals.user,
		userId: event.locals.user?.id,
		userIdentifier: event.locals.user?.identifier,
		environment: process.env.NODE_ENV,
		timestamp: new Date().toISOString()
	}

	return json(debugInfo)
} 