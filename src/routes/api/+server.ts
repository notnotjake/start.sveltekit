import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ request }) => {
	return new Response(JSON.stringify({ message: 'Hello from API' }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	})
}
