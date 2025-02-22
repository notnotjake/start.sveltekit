import { Hono } from 'hono'
import type { RequestHandler } from './$types'
import {
	createUser,
	getUserByIdentifier,
	deleteUser,
	updateUserName,
	updateUserIdentifier
} from '$lib/server/auth/users'

import { setDelay, withDelay } from '$lib/server/auth/utils'

const app = new Hono()

app.get('/api/status', (c) => {
	return c.json({ data: 'okay' })
})

app.post('/api/login', async (c) => {
	const body = await c.req.json()

	const identifier: string = body.email

	// Check identifier (email)
	if (!identifier || typeof identifier !== 'string') {
		return c.json({ error: 'Email not valid' }, 400)
	}

	const userExists = await getUserByIdentifier(identifier)

	if (userExists) {
		// send a magic link
		// verify magic link
		// take user and associate with session
	} else {
		// send verification email
		// verify link
		// create account for identifier
	}
})

app.post('/api/create-user', async (c) => {
	const body = await c.req.json()

	const identifier = body.identifier ?? null
	const name = body.name ?? null

	if (identifier && name) {
		const newUser = await createUser(identifier, name)
		console.log(newUser)
	}

	return c.json({ sucess: true })
})

app.post('/api/get-user', async (c) => {
	const delay = setDelay(1500)
	const body = await c.req.json()

	const identifier = body.identifier ?? null

	let userId = null
	if (identifier) {
		const result = await getUserByIdentifier(identifier)
		if (result) {
			userId = result
		} else {
			return c.text('No user found')
		}

		return withDelay(delay, c.json({ userId: userId }))
	}
	return withDelay(delay, c.text('Something went wrong'))
})

app.post('/api/update-user-name', async (c) => {
	const body = await c.req.json()

	const identifier = body.id ?? null
	const newName = body.newValue ?? null
	if (!identifier || !newName) {
		return c.text('Identifier invalid or not defined')
	}

	const result = await getUserByIdentifier(identifier)
	if (!result) {
		return c.text('No user found')
	}
	const userId = result[0].id

	try {
		await updateUserName(userId, newName)
		return c.text('Name updated')
	} catch (error) {
		return c.text('Error when updating record')
	}
})

app.post('/api/update-user-email', async (c) => {
	const body = await c.req.json()

	const identifier = body.id ?? null
	const newEmail = body.newValue ?? null
	if (!identifier || !newEmail) {
		return c.text('Identifier invalid or not defined')
	}

	const result = await getUserByIdentifier(identifier)
	if (!result) {
		return c.text('No user found')
	}
	const userId = result[0].id

	try {
		await updateUserIdentifier(userId, newEmail)
		return c.text('Email updated')
	} catch (error) {
		return c.text('Error when updating record')
	}
})

app.post('/api/delete-user', async (c) => {
	const body = await c.req.json()

	const identifier = body.identifier ?? null
	if (!identifier) {
		return c.text('Identifier invalid or not defined')
	}

	const result = await getUserByIdentifier(identifier)
	if (!result) {
		return c.text('No user found')
	}

	let userId = result[0].id

	try {
		await deleteUser(userId)
		return c.text('User deleted')
	} catch (error) {
		return c.text('Something went wrong')
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
