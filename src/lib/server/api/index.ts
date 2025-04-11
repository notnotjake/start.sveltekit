import { Hono } from 'hono'

const app = new Hono().basePath('/api')

app.get('/status', (c) => {
	return c.json({ status: 'ok' }, 200)
})

app.notFound((c) => {
	return c.json({ error: 'Route not found' }, 404)
})

app.onError((err, c) => {
	console.error(`${err}`)
	return c.json({ error: 'Something went wrong' }, 500)
})

export default app
