import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'

const authRoutes = new Hono()

authRoutes.post('/status', (c) => {
	return c.json({ data: 'okay' })
})

export { authRoutes }
