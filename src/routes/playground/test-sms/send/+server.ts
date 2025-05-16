import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import Prelude from '@prelude.so/sdk'
import { env } from '$env/dynamic/private'

const client = new Prelude({
	apiToken: env.PRELUDE_AUTH
})

export const POST: RequestHandler = async (event) => {
	const body = await event.request.json()
	const { number } = body

	// const ipAddress = event.getClientAddress() || 'unknown'
	// const userAgent = event.request.headers.get('user-agent') || 'unknown'

	const verification = await client.verification.create({
		target: {
			type: 'phone_number',
			value: number
		}
	})

	console.log(verification.id)

	return json({ success: true })
}
