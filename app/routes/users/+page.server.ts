import type { Actions, ServerLoad } from '@sveltejs/kit'

import { db } from '$lib/server/db'
import { userTable } from '$lib/server/db/schema'

export const load: ServerLoad = async () => {
	const users = await db
		.select({
			field1: userTable.name,
			field2: userTable.id
		})
		.from(userTable)

	return {
		users: users
	}
}

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData()

		const setId = String(data.get('id'))
		const setName = String(data.get('username'))
		const setIdentifier = String(data.get('credential-type')) + ':' + String(data.get('contact'))

		console.log(setId)
		console.log(setName)
		console.log(setIdentifier)

		const insertResult = await db
			.insert(userTable)
			.values({
				id: setId,
				name: setName,
				identifier: setIdentifier
			})
			.onConflictDoNothing({ target: userTable.id })
			.returning()

		if (insertResult.length === 0) {
			return { success: false, message: 'User already exists' }
		} else {
			return { success: true, message: 'User added' }
		}
	}
}
