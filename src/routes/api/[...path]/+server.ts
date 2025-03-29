import { Hono } from 'hono'
import type { RequestHandler } from './$types'
import { verifyPassword, addPassword } from '$lib/server/auth/password'

const app = new Hono()

app.get('/api/status', (c) => {
	return c.json({ data: 'okay' })
})

app.post('/api/login', async (c) => {
	const body = await c.req.json()

	const identifier: string = body.identifier
	const password: string = body.password

	const result = await verifyPassword(identifier, password)

	console.log(result)

	return c.json({ data: 'okay' })
})

app.post('/api/register-password', async (c) => {
	const body = await c.req.json()

	const identifier: string = body.identifier
	const password: string = body.password

	console.log(password)

	const result = await addPassword(identifier, password)

	console.log(result)

	return c.json({ data: 'okay' })
})

// Catch-all for unmatched routes in Hono
app.notFound((c) => {
	return c.json({ error: 'Route not found' }, 404)
})

export const GET: RequestHandler = async ({ request }) => {
	return app.fetch(request)
}

export const POST: RequestHandler = async ({ request }) => {
	return app.fetch(request)
}
