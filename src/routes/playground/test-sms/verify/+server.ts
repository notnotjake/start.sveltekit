import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import Prelude from '@prelude.so/sdk'
import { env } from '$env/dynamic/private'

const client = new Prelude({
	apiToken: env.PRELUDE_AUTH
})

export const POST: RequestHandler = async (event) => {
	const body = await event.request.json()
	const { code, number } = body

	const verify = await client.verification.check({
		target: {
			type: 'phone_number',
			value: number
		},
		code: code
	})

	console.log(verify.id)

	if (verify.status) {
		return json({ success: true })
	} else {
		return json({ success: false })
	}
}
