import { Hono } from 'hono'
import type { RequestHandler } from './$types'

import { authRoutes } from './auth'

const app = new Hono()

app.route('/api/auth', authRoutes)

// Simple health status
app.get('/api/status', (c) => {
	return c.json({ data: 'okay' })
})
// Catch-all for unmatched routes in Hono
app.notFound((c) => {
	return c.json({ error: 'Route not found' }, 404)
})

// Attache to SvelteKit's handlers
export const GET: RequestHandler = async (event) => {
	return app.fetch(event.request)
}
export const POST: RequestHandler = async (event) => {
	return app.fetch(event.request)
}
