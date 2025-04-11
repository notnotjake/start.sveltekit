import type { RequestHandler } from './$types'
import app from '$lib/server/api'

// Attache to SvelteKit's handlers
export const GET: RequestHandler = async ({ request }) => {
	return app.fetch(request)
}
export const POST: RequestHandler = async ({ request }) => {
	return app.fetch(request)
}
