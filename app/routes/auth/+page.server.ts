import type { Actions } from '@sveltejs/kit'
import { generateSessionToken } from '$lib/server/auth'

export const actions: Actions = {
	createTestSession: async () => {
		const token = generateSessionToken()
		return {
			success: true,
			data: {
				token
			}
		}
	}
}
