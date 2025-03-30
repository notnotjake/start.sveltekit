import { Hono } from 'hono'
import type { RequestHandler } from './$types'
import { verifyPassword, addPassword, updatePassword } from '$lib/server/auth/password'

const app = new Hono()

app.get('/api/status', (c) => {
	return c.json({ data: 'okay' })
})

app.post('/api/login-password', async (c) => {
	const body = await c.req.json()

	const identifier: string = body.identifier
	const password: string = body.password

	try {
		const result = await verifyPassword(identifier, password)

		if (result.success) {
			return c.json({ data: 'okay', user: result.data })
		} else {
			return c.json({ data: 'failed', message: result.error })
		}
	} catch (e) {
		console.log(e)
		return c.json({ data: 'failed' })
	}
})

app.post('/api/register-password', async (c) => {
	const body = await c.req.json()

	const identifier: string = body.identifier
	const password: string = body.password

	try {
		const result = await addPassword(identifier, password)
		if (result.success) {
			return c.json({ data: 'okay' })
		} else {
			return c.json({ data: 'failed', message: result.error })
		}
	} catch (e) {
		console.log(e)
		return c.json({ data: 'failed' })
	}
})

app.post('/api/update-password', async (c) => {
	const body = await c.req.json()

	const identifier: string = body.identifier
	const currentPassword: string = body.currentPassword
	const newPassword: string = body.newPassword

	try {
		const result = await updatePassword(identifier, currentPassword, newPassword)
		if (result.success) {
			return c.json({ data: 'okay' })
		} else {
			return c.json({ data: 'failed', message: result.error })
		}
	} catch (e) {
		console.log(e)
		return c.json({ data: 'failed' })
	}
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
