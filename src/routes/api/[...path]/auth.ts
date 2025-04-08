import { Hono } from 'hono'

import Auth from '$lib/server/auth'
import { verifyRegistrationResponse } from '@simplewebauthn/server'

const authRoutes = new Hono()

authRoutes.post('/status', (c) => {
	return c.json({ data: 'okay' })
})

export { authRoutes }
