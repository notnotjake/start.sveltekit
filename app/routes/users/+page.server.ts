import { db } from '$lib/server/db'
import { user } from '$lib/server/db/schema'

import type { Actions, PageLoad } from '@sveltejs/kit'

export const load: PageLoad = async () => {
	const users = await db
		.select({
			field1: user.name,
			field2: user.id
		})
		.from(user)

	return {
		users: users
	}
}

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData()

		const id = String(data.get('id'))
		const name = String(data.get('username'))
		const identifier = String(data.get('credential-type')) + ':' + String(data.get('contact'))

		console.log(id)
		console.log(name)
		console.log(identifier)

		const insertResult = await db
			.insert(user)
			.values({
				id: id,
				name: name,
				identifier: identifier
			})
			.onConflictDoNothing({ target: user.id })
			.returning()

		if (insertResult.length === 0) {
			return { success: false, message: 'User already exists' }
		} else {
			return { success: true, message: 'User added' }
		}
	}
}
